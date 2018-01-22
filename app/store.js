// @flow
import {
  forwardToRenderer,
  triggerAlias,
  replayActionMain,
} from 'electron-redux';
import { createStore, applyMiddleware, compose } from 'redux';
// import { createBrowserHistory } from 'history';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';

import rootReducer from '../editor/reducer';

// const history = createBrowserHistory();

const isDev = process.env.NODE_ENV === 'development';

export const configureStore = () => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // // Thunk Middleware
  // middleware.push(thunk);

  // Logging Middleware
  if (isDev) {
    const logger = createLogger({ level: 'info', collapsed: true });
    middleware.push(logger);
  }

  // // Router Middleware
  // const router = routerMiddleware(history);
  // middleware.push(router);

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(triggerAlias, ...middleware, forwardToRenderer));
  const enhancer = compose(...enhancers);

  // Create Store
  const store = createStore(rootReducer, {}, enhancer);

  if (isDev && module.hot) {
    module.hot.accept('../editor/reducer', () => {
      const reducerModule = require('../editor/reducer'); // eslint-disable-line global-require
      store.replaceReducer(reducerModule);
      return replayActionMain(store);
    });
  }

  return replayActionMain(store);
};
