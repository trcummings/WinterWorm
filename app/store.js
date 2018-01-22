// @flow
import {
  forwardToRenderer,
  triggerAlias,
  replayActionMain,
} from 'electron-redux';
import { createStore, applyMiddleware, compose } from 'redux';
// import { createMemoryHistory } from 'history';
// import { createLogger } from 'redux-logger';
// import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import rootReducer from '../editor/reducer';

// const memoryHistory = createMemoryHistory();

// const isDev = process.env.NODE_ENV === 'development';

export const configureStore = () => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // // Thunk Middleware
  // middleware.push(thunk);

  // Logging Middleware
  // if (isDev) {
  //   const logger = createLogger({ level: 'info', collapsed: true });
  //   middleware.push(logger);
  // }

  // // // Router Middleware
  // const router = routerMiddleware(memoryHistory);
  // middleware.push(router);

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
  // const history = syncHistoryWithStore(memoryHistory, store);

  replayActionMain(store);

  return { store };
};
