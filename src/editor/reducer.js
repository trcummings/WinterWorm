import { combineReducers } from 'redux';
import data from './modules/data';
import editorConfig from './modules/editorConfig';
import windows from './modules/windows';
import inspector from './modules/inspector';

const reducer = combineReducers({
  data,
  windows,
  inspector,
  editorConfig,
});

export default reducer;
