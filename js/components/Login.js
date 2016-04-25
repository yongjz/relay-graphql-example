import React from 'react';
import Relay from 'react-relay';
import LoginMutation from '../mutations/LoginMutation';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  setValue(field, event) {
    var object = {};
    object[field] = event.target.value;
    this.setState(object);
  }

  _handleLogin = (e) => {
    e.preventDefault();
    var details = {
      username: this.refs.usernameInput.value,
      password: this.refs.passwordInput.value,
    };
    Relay.Store.commitUpdate(
      new LoginMutation({credentials: details})
    );
    this.refs.usernameInput.value = '';
    this.refs.passwordInput.value = '';
  }

  render() {
    return (
      <div>
        <input type="text" placeholder="input username" ref="usernameInput" onChange={this.setValue.bind(this, 'username')}/>
        <input type="password" placeholder="input password" ref="passwordInput" onChange={this.setValue.bind(this, 'password')}/>
        <input type="button" value="login" onClick={this._handleLogin}/>
      </div>
    );
  }
}

export default Relay.createContainer(Login, {
  fragments: {
    user: () => Relay.QL`
    fragment on User {
      id,
      userID,
      mail,
      username,
      ${LoginMutation.getFragment('user')}
    }
    `
  }
});
