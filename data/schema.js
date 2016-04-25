import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  Game,
  HidingSpot,
  checkHidingSpotForTreasure,
  getGame,
  getHidingSpot,
  getHidingSpots,
  getTurnsRemaining,
  login,
  getUser,
  getUserByCredentials
} from './database';

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Game') {
      return getGame(id);
    } else if (type === 'HidingSpot') {
      return getHidingSpot(id);
    } if (type === 'User') {
      return getUser();
    } else {
      return null;
    }
  },
  (obj) => {
    if(obj instanceof Game) {
      return gameType;
    } else if (obj instanceof HidingSpot) {
      return hidingSpotType;
    } else if (obj instanceof User) {
      return userType;
    } else {
      return null;
    }
  }
);

var userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    //this field is useless you can do fromGlobalID(id)
    userID: {
      type: GraphQLString,
      description: 'the database user\'s id',
    },
    username: {
      type: GraphQLString,
      description: 'the name of the user',
    },
    mail: {
      type: GraphQLString,
      description: 'the mail of the user',
    },
  },
});

// var loginType = new GraphQLObjectType({
//   name: 'Login',
//   description: 'User login',
//   fields: () => ({
//     id: globalIdField('Login'),
//     isLogin: {
//       type: GraphQLBoolean,
//       description: 'is user login?',
//       resolve: (user) => user.isLogin,
//     },
//     username: {
//       type: GraphQLString,
//       description: 'user name',
//       resolve: (user) => user.username,
//     }
//   }),
//   interfaces: [nodeInterface],
// });

var gameType = new GraphQLObjectType({
  name: 'Game',
  description: 'A treasure search game',
  fields: () => ({
    id: globalIdField('Game'),
    hidingSpots: {
      type: hidingSpotConnection,
      description: 'Places where treasure might be hidden',
      args: connectionArgs,
      resolve: (game, args) => connectionFromArray(getHidingSpots(), args),
    },
    turnsRemaining: {
      type: GraphQLInt,
      description: 'The number of turns a player has left to find the treasure',
      resolve: () => getTurnsRemaining(),
    },
  }),
  interfaces: [nodeInterface],
});

var hidingSpotType = new GraphQLObjectType({
  name: 'HidingSpot',
  description: 'A place where you might find treasure',
  fields: () => ({
    id: globalIdField('HidingSpot'),
    hasBeenChecked: {
      type: GraphQLBoolean,
      description: 'True if this spot has already been checked for treasure',
      resolve: (hidingSpot) => hidingSpot.hasBeenChecked,
    },
    hasTreasure: {
      type: GraphQLBoolean,
      description: 'True if this hiding spot holds treasure',
      resolve: (hidingSpot) => {
        if (hidingSpot.hasBeenChecked) {
          return hidingSpot.hasTreasure;
        } else {
          return null;
        }
      },
    },
    testField: {
      type: GraphQLInt,
      description: 'this is a test field',
      resolve: (hidingSpot) => hidingSpot.testField,
    }
  }),
  interfaces: [nodeInterface],
});

var {connectionType: hidingSpotConnection} =
  connectionDefinitions({name: 'HidingSpot', nodeType: hidingSpotType});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    game: {
      type: gameType,
      resolve: () => getGame(),
    },
    user: {
      type: userType,
      resolve: () => getUser(),
    }
  }),
});

var CheckHidingSpotForTreasureMutation = mutationWithClientMutationId({
  name: 'CheckHidingSpotForTreasure',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    hidingSpot: {
      type: hidingSpotType,
      resolve: ({localHidingSpotId}) => getHidingSpot(localHidingSpotId),
    },
    game: {
      type: gameType,
      resolve: () => getGame(),
    },
  },
  mutateAndGetPayload: ({id}) => {
    var localHidingSpotId = fromGlobalId(id).id;
    checkHidingSpotForTreasure(localHidingSpotId);
    return {localHidingSpotId};
  },
});

// var LoginMutation = mutationWithClientMutationId({
//   name: 'CheckLogin',
//   inputFields: {
//     username: {
//       type: new GraphQLNonNull(GraphQLString)
//     },
//     password: {
//       type: new GraphQLNonNull(GraphQLString)
//     }
//   },
//   outputFields: {
//     // user通过resolve方法得到数据，然后把数据传递给loginType，对应的loginType通过user使用数据
//     user: {
//       type: loginType,
//       resolve: (userInfo) => userInfo,
//     }
//   },
//   mutateAndGetPayload: ({username, password}) => {
//     console.log(username);
//     console.log(password);
//     var userInfo = login(username, password);
//     console.log(userInfo);
//     //此处返回数据后，outputFields即可得到返回的数据，通过返回数据的名称直接使用
//     return userInfo;
//   },
// });

var LoginMutation = mutationWithClientMutationId({
  name: 'Login',
  inputFields: {
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    },
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    user: {
      type: userType,
      resolve: (newUser) => newUser
    }
  },
  mutateAndGetPayload: (credentials) => {
    console.log('schema:loginmutation', credentials);
    var newUser = getUserByCredentials(credentials);
    return newUser;
  }
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    checkHidingSpotForTreasure: CheckHidingSpotForTreasureMutation,
    loginMutation: LoginMutation,
  }),
});

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
