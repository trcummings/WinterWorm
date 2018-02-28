// Action Types
const SET_ENTITY = 'inspector/entity/SET_ENTITY';

// Action Creators
export const setEntity = payload => dispatch => dispatch({
  type: SET_ENTITY,
  payload,
});

// Selectors
export const getInspectorEntity = state => state.inspector.entity;

// Reducer
const INITIAL_STATE = {
  components: [],
};

export default function entity(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case SET_ENTITY: return payload;
    default: return state;
  }
}
