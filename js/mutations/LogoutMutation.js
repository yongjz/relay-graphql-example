import Relay from 'react-relay';

export default class LogoutMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        userID,
        username,
        mail
      }
    `,
  };

  getMutation() {
    return Relay.QL `mutation{logoutMutation}`;
  }

  getVariables() {
    return {
      username: this.props.credentials.username,
      id: this.props.user.id
    };
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      }
    }];
  }

  getFatQuery() {
    return Relay.QL`
    fragment on LogoutPayload {
      user {
        id
        userID,
        username,
        mail,
      }
    }
    `;
  }
}
