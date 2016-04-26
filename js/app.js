import 'babel-polyfill';

import App from './components/App';
import Login from './components/Login';
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
    />
  </Router>,
  document.getElementById('root')
);
