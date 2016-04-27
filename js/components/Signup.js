import React from 'react';
import Relay from 'react-relay';
import SignupMutation from '../mutations/SignupMutation';

export class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      mail: '',
      password: '',
    }
  }

  setValue(field, event) {
    var object = {};
    object[field] = event.target.value;
    this.setState(object);
  }

  _handleSignup = (e) => {
    e.preventDefault();
    var details = {
      username: this.refs.usernameInput.value,
      mail: this.refs.mailInput.value,
      password: this.refs.passwordInput.value,
    };
    Relay.Store.commitUpdate(
      new SignupMutation({credentials: details, user: this.props.user})
    );
    this.refs.usernameInput.value = '';
    this.refs.mailInput.value = '';
    this.refs.passwordInput.value = '';
  }

  render() {
    const {username} = this.props.user;
    var signupInfo = username ? <p>signup success, username: { username }</p>
      : <p>signup fail</p>
    return (
      <div>
        <input type="text" placeholder="input username" ref="usernameInput" />
        <input type="text" placeholder="input mail" ref="mailInput" />
        <input type="password" placeholder="input password" ref="passwordInput" />
        <input type="password" placeholder="input password" ref="passwordConfirmInput" />
        <input type="button" value="signup" onClick={this._handleSignup}/>
        {signupInfo}
      </div>
    );
  }
}

export default Relay.createContainer(Signup, {
  fragments: {
    user: () => Relay.QL`
    fragment on User {
      id,
      userID,
      mail,
      username,
      ${SignupMutation.getFragment('user')}
    }
    `
  }
});
