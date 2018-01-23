// @flow
import { combineReducers } from 'redux';
import loader from './modules/loader';
import preview from './modules/preview';
import specs from './modules/specs';
import scenes from './modules/scenes';

const reducer = combineReducers({
  preview,
  loader,
  specs,
  scenes,
});

export default reducer;
