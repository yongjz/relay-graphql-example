import 'babel-polyfill';

import App from './components/App';
import Login from './components/Login';
import Signup from './components/Signup';
import List from './components/List';
import MyEditor from './components/MyEditor';
import MediaEditor from './components/MediaEditor';
import AppHomeRoute from './routes/AppHomeRoute';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import useRelay from 'react-router-relay';
import createHashHistory from 'history/lib/createHashHistory';
import { applyRouterMiddleware, Router, Route, browserHistory } from 'react-router';

const GameQueries = {
  game: () => Relay.QL`query { game }`
};

const UserQueries = {
  user: () => Relay.QL`query { user }`
};

const TeasQueries = {
  store: () => Relay.QL`query { store  }`
};

ReactDOM.render(
  // <Relay.RootContainer
  //   Component={App}
  //   route={new AppHomeRoute()}
  // />
  <Router
    history={browserHistory}
    render={applyRouterMiddleware(useRelay)}
    environment={Relay.Store}
  >
    <Route
      path="/" component={App}
      queries={GameQueries}
    />
    <Route
      path="login" component={Login}
      queries={UserQueries}
    />
    <Route
      path="signup" component={Signup}
      queries={UserQueries}
    />
    <Route
      path="tea" component={List}
      queries={TeasQueries}
    />
    <Route
      path="editor" component={MyEditor}
    />
    <Route
      path="media" component={MediaEditor}
    />
  </Router>,
  document.getElementById('root')
);
