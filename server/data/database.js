import models from '../models';
var UserDb = models.User;

export class Game {}
export class HidingSpot {}

var game = new Game();
game.id = '1';

const logID = 'qldfjbe2434RZRFeerg';

var hidingSpots = [];
(function() {
  var hidingSpot;
  var indexOfSpotWithTreasure = Math.floor(Math.random() * 9);
  console.log(indexOfSpotWithTreasure);
  for (var i = 0; i < 9; i++) {
    hidingSpot = new HidingSpot();
    hidingSpot.id = `${i}`;
    hidingSpot.hasTreasure = (i === indexOfSpotWithTreasure);
    hidingSpot.testField = i;
    hidingSpot.hasBeenChecked = false;
    hidingSpots.push(hidingSpot);
  }
})();

var turnsRemaining = 3;

export function checkHidingSpotForTreasure(id) {
  if (hidingSpots.some(hs => hs.hasTreasure && hs.hasBeenChecked)) {
    return;
  }
  turnsRemaining--;
  var hidingSpot = getHidingSpot(id);
  hidingSpot.hasBeenChecked = true;
}

export function getHidingSpot(id) {
  return hidingSpots.find(hs => hs.id === id);
}

export function getGame() {
  return game;
}

export function getHidingSpots() {
  return hidingSpots;
}

export function getTurnsRemaining() {
  return turnsRemaining;
}

export function login(username, password) {
  UserDb.findOne({username: username}, function(err, userdb) {
    if (err) {
      console.log(err);
    }
    if (!userdb) {
      return {
        username: '',
        mail: '',
        userID: '',
      };
    }

    if (password === userdb.password) {
      console.log('login success');
      return userdb;
    } else {
      return {
        username: '',
        mail: '',
        userID: '',
      };
    }
  });
  // user.isLogin = false;
  // user.username = 'guest';
  // if (username === 'admin' && password === '123456') {
  //   user.isLogin = true;
  //   user.username = 'admin'
  // }
  // return user;
}

export function getUser(_, args, session) {
  console.log("exec getUser");
  if(session.user) {
    console.log('exec getUser session.user');
    return session.user;
  } else {
    return {
      username: '',
      mail: '',
      userID: '',
    };
  }
}

export function getUserByCredentials(credentials, rootValue) {
  if (credentials.username === '') {
    // rootValue.cookies.set('userID', '');
    return {
      username: '',
      mail: '',
      userID: '',
      id: logID
    };
  }

  UserDb.findOne({username: credentials.username}, function(err, userdb) {
    if (err) {
      console.log(err);
    }
    if (!userdb) {
      return {
        username: '',
        mail: '',
        userID: '',
      };
    }

    if (credentials.password === userdb.password) {
      console.log('login success');
      console.log(userdb);
      return {
        username: userdb.username,
        mail: userdb.mail,
        userID: userdb._id,
      };
    } else {
      return {
        username: '',
        mail: '',
        userID: '',
      };
    }
  });

  // if (credentials.username === 'admin' && credentials.password === '123456') {
  //   user.username = 'admin';
  //   user.mail = 'admin@admin.com';
  //   user.userID = '1';
  //   user.id = logID;
  // } else {
  //   user.username = '';
  //   user.mail = '';
  //   user.userID = '';
  //   user.id = logID;
  // }
  // rootValue.cookies.set('userID', user.userID);
  // console.log('database:getUserByCredentials:', user);
  // return user;
}

export function addUser(credentials, session) {
  console.log('exec addUser');
  var userdb = new UserDb();
  //newUser.userID = users.length + 1;
  userdb.username = credentials.username;
  userdb.mail = credentials.mail;
  userdb.password = credentials.password;
  //newUser.id = logID;
  // users.push(newUser);
  // console.log(users);
  // user = newUser;
  userdb.save(function(err, user) {
    if (err) {
      console.log(err);
      return {
        username: '',
        mail: '',
        userID: '',
      }
    }
    session.user = user;
    console.log(session);
    return user;
  });
}
