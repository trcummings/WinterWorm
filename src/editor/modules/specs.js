import { view, lensPath, over } from 'ramda';
import { createSelector } from 'reselect';

import { symbols } from '../constants';

const ADD_SPEC = 'specs/ADD_SPEC';
const LOAD_SPEC = 'specs/LOAD_SPEC';
const SET_CURRENT_SCENE = 'specs/SET_CURRENT_SCENE';

// Action Creators
export const setSpec = spec => dispatch => dispatch({
  type: ADD_SPEC,
  payload: spec,
});

export const setCurrentScene = sceneId => dispatch => dispatch({
  type: SET_CURRENT_SCENE,
  payload: sceneId,
});

export const loadSpec = spec => dispatch => dispatch({
  type: LOAD_SPEC,
  payload: spec,
});

const scenePath = [symbols.SCENES];
const entityPath = [symbols.ENTITIES];
const typePathMap = {
  [symbols.SCENES]: scenePath,
  [symbols.ENTITIES]: entityPath,
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
  [symbols.ENTITIES]: {},
};

export default function specs(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case ADD_SPEC: return setSpecInState(state, payload);
    case LOAD_SPEC: return payload;
    case SET_CURRENT_SCENE: return { ...state, [symbols.CURRENT_SCENE]: payload };
    default: return state;
  }
}
