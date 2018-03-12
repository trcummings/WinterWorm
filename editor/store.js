import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';

import rootReducer from './reducer';

const isDev = process.env.NODE_ENV === 'development';

export const thunk = ({ dispatch, getState }) => next => (action) => {
  if (typeof action === 'function') return action(dispatch, getState);
  return next(action);
};

export const configureStore = () => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];
  const initialState = {};

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  if (isDev) {
    const logger = createLogger({ level: 'info', collapsed: true });
    middleware.push(logger);
  }

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
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

  return { store };
};
