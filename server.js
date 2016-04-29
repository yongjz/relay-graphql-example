import express from 'express';
import session from 'express-session';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {
  Schema
} from './server/data/schema';
import mongoose from 'mongoose';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;
const DATABASE_URI = 'mongodb://localhost:27017/relay-graphql-example';

// Expose a GraphQL endpoint
var graphQLServer = express();

graphQLServer.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000
  }
}));

graphQLServer.use('/', graphQLHTTP(request => ({
  schema: Schema,
  context: request.session,
  graphiql: true,
  pretty: true,
})));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

// Serve the Relay app
var compiler = webpack({
  entry: path.resolve(__dirname, 'js', 'app.js'),
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      test: /\.js$/,
    }]
  },
  output: {
    filename: 'app.js',
    path: '/'
  }
});
var app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: {
    '/graphql': `http://localhost:${GRAPHQL_PORT}`
  },
  publicPath: '/js/',
  stats: {
    colors: true
  },
  historyApiFallback: true,
});

mongoose.connect(DATABASE_URI);

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')));
app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
