// @flow
import { Map } from 'immutable';

import type { EditorState } from 'App/observations/editor';
import type { State, Dispatch } from 'Editor/types';

// Action Types
export const SET_EDITOR_CONFIG = 'editorConfig/SET_EDITOR_CONFIG';

// Selectors
export const getEditorConfig = (state: State) => state.editorConfig;

// Action creators
type Action = {
  type: typeof SET_EDITOR_CONFIG,
  payload: EditorState
};

export const setEditorConfig =
  (payload: EditorState) =>
    (dispatch: Dispatch<Action>) =>
      dispatch({ type: SET_EDITOR_CONFIG, payload });

// Reducer
const INITIAL_STATE = Map({
  isNew: undefined,
  filename: undefined,
});

const editorConfig = (
  state: Map<$Keys<EditorState>, $Values<EditorState>> = INITIAL_STATE,
  action: Action
) => {
  const { type, payload } = action;

  switch (type) {
    case SET_EDITOR_CONFIG: return Map({ ...payload });
    default: return state;
  }
};

export default editorConfig;
