import Relay from 'react-relay';

export default class LoginMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        username,
        mail
      }
    `,
  };

  getMutation() {
    return Relay.QL `mutation{loginMutation}`;
  }

  getVariables() {
    return {
      username: this.props.credentials.username,
      password: this.props.credentials.password,
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
    fragment on LoginPayload {
      user {
        userID,
        username,
        mail,
      }
    }
    `;
  }
}
