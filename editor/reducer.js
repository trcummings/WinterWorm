// 
import { combineReducers } from 'redux';
import specs from './modules/specs';
import preview from './modules/preview';
import filesystem from './modules/filesystem';
import config from './modules/config';
import windows from './modules/windows';
import inspector from './modules/inspector';

const reducer = combineReducers({
  specs,
  preview,
  filesystem,
  config,
  windows,
  inspector,
});

export default reducer;
