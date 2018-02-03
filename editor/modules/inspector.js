import { combineReducers } from 'redux';

// Action Types
const SELECT_INSPECTOR = 'inspector/SELECT_INSPECTOR';

// Action Creators
export const selectInspector = ({ inspectorType, id }) => dispatch => dispatch({
  type: SELECT_INSPECTOR,
  payload: { inspectorType, id },
});

// Selectors
export const getInspectorControl = state => state.inspector.control;

// Reducer
const INITIAL_STATE = {
  inspectorType: null,
  id: null,
};

function control(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case SELECT_INSPECTOR: return payload;
    default: return state;
  }
}

const inspector = combineReducers({
  control,
});

export default inspector;
