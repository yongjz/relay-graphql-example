import Relay from 'react-relay';

export default class SignupMutation extends Relay.Mutation {
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
    return Relay.QL `mutation{signupMutation}`;
  }

  getVariables() {
    return {
      username: this.props.credentials.username,
      mail: this.props.credentials.mail,
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
    fragment on SignupPayload {
      user {
        userID,
        username,
        mail,
      }
    }
    `;
  }
}
