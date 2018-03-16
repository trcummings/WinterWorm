import { combineReducers } from 'redux';
import data from './modules/data';
import specs from './modules/specs';
import preview from './modules/preview';
import filesystem from './modules/filesystem';
import config from './modules/config';
import editorConfig from './modules/editorConfig';
import windows from './modules/windows';
import inspector from './modules/inspector';

const reducer = combineReducers({
  data,
  specs,
  preview,
  filesystem,
  config,
  windows,
  inspector,
  editorConfig,
});

export default reducer;