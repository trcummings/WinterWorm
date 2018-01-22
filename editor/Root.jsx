// @flow
import React, { Children } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
// import { importGithubProjects } from './actions';

const Root = ({ store, history, children }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      { Children.only(children) }
    </ConnectedRouter>
  </Provider>
);

export default Root;
