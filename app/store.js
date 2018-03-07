// @flow
import 'regenerator-runtime/runtime';
import {
  forwardToRenderer,
  triggerAlias,
  replayActionMain,
} from 'electron-redux';
import { createStore, applyMiddleware, compose } from 'redux';

import rootReducer from '../editor/reducer';
import { thunk } from '../editor/store';

const logger = _ => next => (action) => {
  console.log(JSON.stringify(action, null, 2));
  return next(action);
};

const isDev = process.env.NODE_ENV === 'development';

export const configureStore = (gameIpcMiddleware) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  if (isDev) middleware.push(logger);

  // IPC Middleware
  if (isDev) middleware.push(gameIpcMiddleware);

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(triggerAlias, ...middleware, forwardToRenderer));
  const enhancer = compose(...enhancers);

  // Create Store
  const store = createStore(rootReducer, {}, enhancer);

  // if (isDev && module.hot) {
  //   module.hot.accept('../editor/reducer', () => {
  //     const reducerModule = require('../editor/reducer'); // eslint-disable-line global-require
  //     store.replaceReducer(reducerModule);
  //     replayActionMain(store);
  //
  //     return store;
  //   });
  // }

  replayActionMain(store);

  return { store };
};
