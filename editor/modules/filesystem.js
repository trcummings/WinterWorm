// Action Types
export const EDITOR_SAVE_START = 'filesystem/EDITOR_SAVE_START';
export const EDITOR_SAVE_ERROR = 'filesystem/EDITOR_SAVE_ERROR';
export const EDITOR_SAVE_COMPLETE = 'filesystem/EDITOR_SAVE_COMPLETE';

// Selectors
const getFS = state => state.filesystem;
export const isGameSaving = state => getFS(state).isSaving;
export const hasGameSaveError = state => getFS(state).error;

// Action creators
export const startSave = () => dispatch => dispatch({
  type: EDITOR_SAVE_START,
});

// Reducer
const INITIAL_STATE = {
  isSaving: false,
  error: null,
};

export default function filesystem(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case EDITOR_SAVE_START: {
      return { error: null, isSaving: true };
    }

    case EDITOR_SAVE_ERROR: {
      return { error: payload, isSaving: false };
    }

    case EDITOR_SAVE_COMPLETE: {
      return INITIAL_STATE;
    }

    default: return state;
  }
}
