// @flow
import { combineReducers } from 'redux';
import specs from './modules/specs';
import preview from './modules/preview';
import filesystem from './modules/filesystem';
import config from './modules/config';

const reducer = combineReducers({
  specs,
  preview,
  filesystem,
  config,
});

export default reducer;
