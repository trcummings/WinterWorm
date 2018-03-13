import { assocPath, dissocPath } from 'ramda';

const RECEIVE_OBJECTS = 'data/RECEIVE_OBJECTS';

export const ADD_ENTITY = 'data/ADD_ENTITY';
export const REMOVE_ENTITY = 'data/REMOVE_ENTITY';
export const ADD_ENTITIES = 'data/ADD_ENTITIES';
export const REMOVE_ENTITIES = 'data/REMOVE_ENTITIES';

const INITIAL_STATE = {};

// Selectors
export const getGameObjects = type => state => state.data[type] || INITIAL_STATE;

// Action Creators
export const loadGameObjects = payload => dispatch => dispatch({
  type: RECEIVE_OBJECTS,
  payload,
});

export default function data(state = INITIAL_STATE, action = {}) {
  const { type, meta, payload } = action;

  switch (type) {
    case RECEIVE_OBJECTS: {
      return payload;
    }

    case ADD_ENTITIES: {
      let newState = state;

      for (const service of Object.keys(payload)) {
        for (const id of Object.keys(payload[service])) {
          const objet = payload[service][id];
          newState = assocPath([service, `${id}`], objet, newState);
        }
      }

      return newState;
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
