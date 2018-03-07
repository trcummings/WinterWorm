import { assocPath, dissocPath } from 'ramda';

const RECEIVE_OBJECTS = 'data/RECEIVE_OBJECTS';

export const ADD_ENTITY = 'data/ADD_ENTITY';
export const REMOVE_ENTITY = 'data/REMOVE_ENTITY';

// Action Creators
export const loadGameObjects = payload => dispatch => dispatch({
  type: RECEIVE_OBJECTS,
  payload,
});

const INITIAL_STATE = {};

export default function data(state = INITIAL_STATE, action = {}) {
  const { type, meta, payload } = action;

  switch (type) {
    case RECEIVE_OBJECTS: {
      return payload;
    }

    case ADD_ENTITY: {
      const { service } = meta;
      const { id } = payload;

      return assocPath([service, `${id}`], payload, state);
    }

    case REMOVE_ENTITY: {
      const { service } = meta;
      const { id } = payload;

      return dissocPath([service, `${id}`], state);
    }

    default: return state;
  }
}
