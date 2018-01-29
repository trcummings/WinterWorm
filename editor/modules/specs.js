import { view, lensPath, over } from 'ramda';
import { createSelector } from 'reselect';

import { symbols } from '../constants';

const ADD_SPEC = 'specs/ADD_SPEC';
const LOAD_SPEC = 'specs/LOAD_SPEC';

// Action Creators
export const setSpec = spec => dispatch => dispatch({
  type: ADD_SPEC,
  payload: spec,
});

export const loadSpec = spec => dispatch => dispatch({
  type: LOAD_SPEC,
  payload: spec,
});

const scenePath = [symbols.SCENES];
const typePathMap = {
  [symbols.SCENES]: scenePath,
};

export const getSpecs = state => state.specs;
const getPropSpecType = (_, ownProps) => ownProps.specType;

export const getSpecsOfType = createSelector(
  [getSpecs, getPropSpecType],
  (allSpecs, type) => view(lensPath(typePathMap[type]), allSpecs)
);

const conjoin = obj2 => obj1 => Object.assign({}, obj1, obj2);
const setSpecInState = (state, spec) => over(
  lensPath(typePathMap[spec.type]),
  conjoin({ [spec.options.id]: spec.options }),
  state
);

const INITIAL_STATE = {
  [symbols.CURRENT_SCENE]: null,
  [symbols.SCENES]: {},
};

export default function specs(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case ADD_SPEC: return setSpecInState(state, payload);
    case LOAD_SPEC: return payload;
    default: return state;
  }
}
