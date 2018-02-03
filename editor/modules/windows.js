import { createSelector } from 'reselect';

// Constants
const MINIMIZED = 'MINIMIZED';
const OPEN = 'OPEN';
export const CONTROL = 'CONTROL';
export const LIBRARY = 'LIBRARY';
export const INSPECTOR = 'INSPECTOR';

// Action Types
const TOGGLE_WINDOW = 'windows/TOGGLE_WINDOW';

// Action Creators
export const toggleWindow = type => dispatch => dispatch({
  type: TOGGLE_WINDOW,
  payload: type,
});

// Selectors
const getWindowType = (_, ownProps) => ownProps.windowType;
const getWindows = state => state.windows;
export const isMinimized = createSelector(
  [getWindows, getWindowType],
  (allWindows, windowType) => allWindows[windowType] === MINIMIZED
);

// Reducer
const INITIAL_STATE = {
  control: OPEN,
  library: OPEN,
  inspector: OPEN,
};

export default function windows(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case TOGGLE_WINDOW: {
      const isOpen = state[payload] === OPEN;
      return {
        ...state,
        [payload]: isOpen
          ? MINIMIZED
          : OPEN,
      };
    }
    default: return state;
  }
}
