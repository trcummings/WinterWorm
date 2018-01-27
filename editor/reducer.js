// @flow
import { combineReducers } from 'redux';
import preview from './modules/preview';
import specs from './modules/specs';

const reducer = combineReducers({
  preview,
  specs,
});

export default reducer;
