import { assocPath, dissocPath } from 'ramda';

const RECEIVE_OBJECTS = 'data/RECEIVE_OBJECTS';

export const ADD_ENTITY = 'data/ADD_ENTITY';
export const REMOVE_ENTITY = 'data/REMOVE_ENTITY';
export const ADD_ENTITIES = 'data/ADD_ENTITIES';
export const REMOVE_ENTITIES = 'data/REMOVE_ENTITIES';

const INITIAL_STATE = {
  entities: {},
  componentStates: {},
  components: {},
  systems: {},
  scenes: {},
  eventTypes: {},
};

const updateRelationsOnDelete = (service, id, state) => {
  switch (service) {
    case 'entities': {
      const { scenes, componentStates } = state;
      return {
        ...state,
        scenes: Object.keys(scenes).reduce((total, sceneId) => {
          const entityIds = scenes[sceneId].entities;

          if (!entityIds.includes(id)) return Object.assign(total, { [sceneId]: scenes[sceneId] });

          const idx = entityIds.findIndex(eId => eId === id);
          const newEntityIds = entityIds.slice();
          newEntityIds.splice(idx, 1);

          return Object.assign(total, {
            [sceneId]: { ...scenes[sceneId], entities: newEntityIds },
          });
        }, {}),
        componentStates: Object.keys(componentStates).reduce((total, csId) => (
          componentStates[csId].entityId === id
            ? total
            : Object.assign(total, { [csId]: componentStates[csId] })
        ), {}),
      };
    }

    default: return state;
  }
};

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
          newState = assocPath([service, id], objet, newState);
        }
      }

      return newState;
    }

    case ADD_ENTITY: {
      const { service } = meta;
      const { id } = payload;

      return assocPath([service, id], payload, state);
    }

    case REMOVE_ENTITY: {
      const { service } = meta;
      const { id } = payload;

      const next = dissocPath([service, id], state);
      return updateRelationsOnDelete(service, id, next);
    }

    default: return state;
  }
}
