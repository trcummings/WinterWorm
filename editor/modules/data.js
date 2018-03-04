// import { view, lensPath, over } from 'ramda';
// import { createSelector } from 'reselect';
// import { symbols } from '../constants';

const RECEIVE_OBJECTS = 'data/RECEIVE_OBJECTS';

// Action Creators
export const loadGameObjects = payload => dispatch => dispatch({
  type: RECEIVE_OBJECTS,
  payload,
});

const INITIAL_STATE = {};

export default function data(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_OBJECTS: return payload;
    default: return state;
  }
}
