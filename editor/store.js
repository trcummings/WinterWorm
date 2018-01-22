// @flow
import {
  forwardToMain,
  replayActionRenderer,
  getInitialStateRenderer,
} from 'electron-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { createMemoryHistory } from 'history';
import { createLogger } from 'redux-logger';
// import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import rootReducer from './reducer';

export const memoryHistory = createMemoryHistory();

const isDev = process.env.NODE_ENV === 'development';

const thunk = store => next => (action) => {
  if (typeof action === 'function') return action(store.dispatch);
  return next(action);
};

export const configureStore = () => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];
  const initialState = getInitialStateRenderer();

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  if (isDev) {
    const logger = createLogger({ level: 'info', collapsed: true });
    middleware.push(logger);
  }

  // // Router Middleware
  // const router = routerMiddleware(memoryHistory);
  // middleware.push(router);

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(forwardToMain, ...middleware));
  const enhancer = compose(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);

  // if (isDev && module.hot) {
  //   module.hot.accept('./reducer', () => {
  //     const reducerModule = require('./reducer'); // eslint-disable-line global-require
  //     store.replaceReducer(reducerModule);
  //     replayActionRenderer(store);
  //
  //     return store;
  //   });
  // }

  replayActionRenderer(store);

  // const history = syncHistoryWithStore(memoryHistory, store);

  return { store };
};
