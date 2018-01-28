// @flow
import { combineReducers } from 'redux';
import specs from './modules/specs';
import preview from './modules/preview';
import filesystem from './modules/filesystem';

const reducer = combineReducers({
  specs,
  preview,
  filesystem,
});

export default reducer;
