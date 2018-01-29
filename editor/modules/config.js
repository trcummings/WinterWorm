// Action Types
export const CONFIG_SAVE_START = 'filesystem/CONFIG_SAVE_START';
export const CONFIG_SAVE_ERROR = 'filesystem/CONFIG_SAVE_ERROR';
export const CONFIG_SAVE_COMPLETE = 'filesystem/CONFIG_SAVE_COMPLETE';

// Selectors
const getConfig = state => state.config;
export const getConfigState = state => getConfig(state).configState;
export const isConfigSaving = state => getConfig(state).isConfigSaving;
export const hasGameSaveError = state => getConfig(state).error;

// Action creators
export const saveConfig = () => dispatch => dispatch({
  type: CONFIG_SAVE_START,
});

// Reducer
const INITIAL_STATE = {
  isConfigSaving: false,
  configState: {},
  error: null,
};

export default function config(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case CONFIG_SAVE_START: {
      return { ...state, error: null, isConfigSaving: true };
    }

    case CONFIG_SAVE_ERROR: {
      return { ...state, error: payload, isConfigSaving: false };
    }

    case CONFIG_SAVE_COMPLETE: {
      return INITIAL_STATE;
    }

    default: return state;
  }
}
