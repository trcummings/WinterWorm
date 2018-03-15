import { Map } from 'immutable';

// Action Types
export const SET_EDITOR_CONFIG = 'editorConfig/SET_EDITOR_CONFIG';

// Selectors
export const getEditorConfig = state => state.editorConfig;

// Action creators
export const setEditorConfig = payload => dispatch => dispatch({
  type: SET_EDITOR_CONFIG,
  payload,
});

// Reducer
const INITIAL_STATE = Map();

export default function editorConfig(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case SET_EDITOR_CONFIG: return Map(payload);
    default: return state;
  }
}
