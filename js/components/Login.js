import React from 'react';
import Relay from 'react-relay';
import LoginMutation from '../mutations/LoginMutation';
import LogoutMutation from '../mutations/LogoutMutation';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
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
      new LoginMutation({credentials: details, user: this.props.user})
    );
    this.refs.usernameInput.value = '';
    this.refs.passwordInput.value = '';
  }

  _handleLogout = (e) => {
    e.preventDefault();
    var details = {
      username: '',
    };
    Relay.Store.commitUpdate(
      new LogoutMutation({credentials: details, user: this.props.user})
    );
  }

  render() {
    var {username} = this.props.user;
    console.log(username);
    var loginInfo = username ?
      <div>
        <p>username: { username }</p>
        <input type="button" value="logout" onClick={this._handleLogout}/>
      </div> :
      <div>
        <input type="text" placeholder="input username" ref="usernameInput" onChange={this.setValue.bind(this, 'username')}/>
        <input type="password" placeholder="input password" ref="passwordInput" onChange={this.setValue.bind(this, 'password')}/>
        <input type="button" value="login" onClick={this._handleLogin}/>
        <p>not login</p>
      </div>
    return (
      <div>
        { loginInfo }
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
