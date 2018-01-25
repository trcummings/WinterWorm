// Action Types
export const RUN_GAME = 'preview/RUN_GAME';
export const STOP_GAME = 'preview/STOP_GAME';

// Action creators
export const startGame = payload => dispatch => dispatch({
  type: RUN_GAME,
  payload,
});

export const stopGame = () => dispatch => dispatch({
  type: STOP_GAME,
});

// Selectors
export const isGameRunning = state => state.preview.isRunning;

// Reducer
const INITIAL_STATE = {
  isRunning: false,
  gameState: null,
};

export default function preview(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case RUN_GAME: {
      return { gameState: payload, isRunning: true };
    }

    case STOP_GAME: {
      return { gameState: null, isRunning: false };
    }

    default: return state;
  }
}
