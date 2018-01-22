// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

const reducer = combineReducers({
  router,
});

export default reducer;
