// Action Types
export const EDITOR_SAVE_START = 'filesystem/EDITOR_SAVE_START';
export const EDITOR_SAVE_ERROR = 'filesystem/EDITOR_SAVE_ERROR';
export const EDITOR_SAVE_COMPLETE = 'filesystem/EDITOR_SAVE_COMPLETE';

export const SPEC_EXPORT_START = 'filesystem/SPEC_EXPORT_START';
export const SPEC_EXPORT_ERROR = 'filesystem/SPEC_EXPORT_ERROR';
export const SPEC_EXPORT_COMPLETE = 'filesystem/SPEC_EXPORT_COMPLETE';

// Selectors
const getFS = state => state.filesystem;
export const isEditorSaving = state => getFS(state).isEditorSaving;
export const isSpecExporting = state => getFS(state).isSpecExporting;
export const hasGameSaveError = state => getFS(state).error;

// Action creators
export const saveEditor = () => dispatch => dispatch({
  type: EDITOR_SAVE_START,
});

export const exportSpec = () => dispatch => dispatch({
  type: SPEC_EXPORT_START,
});

// Reducer
const INITIAL_STATE = {
  isEditorSaving: false,
  isSpecExporting: false,
  error: null,
};

export default function filesystem(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case EDITOR_SAVE_START: {
      return { error: null, isEditorSaving: true };
    }

    case EDITOR_SAVE_ERROR: {
      return { error: payload, isEditorSaving: false };
    }

    case EDITOR_SAVE_COMPLETE: {
      return INITIAL_STATE;
    }

    case SPEC_EXPORT_START: {
      return { error: null, isSpecExporting: true };
    }

    case SPEC_EXPORT_ERROR: {
      return { error: payload, isSpecExporting: false };
    }

    case SPEC_EXPORT_COMPLETE: {
      return INITIAL_STATE;
    }

    default: return state;
  }
}
