// @flow
import { combineReducers } from 'redux';
import loader from './modules/loader';
import preview from './modules/preview';

const reducer = combineReducers({
  preview,
  loader,
});

export default reducer;
