import React from 'react';
import Relay from 'react-relay';

export default class Login extends React.Component {
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

  _handleLogin() {
    if(this.state.username === 'admin' && this.state.password === '123456') {
      alert('login success');
    }
  }

  render() {
    return (
      <div>
        <input type="text" onChange={this.setValue.bind(this, 'username')}/>
        <input type="password" onChange={this.setValue.bind(this, 'password')}/>
        <input type="button" value="login" onClick={this._handleLogin.bind(this)}/>
      </div>
    );
  }
}
