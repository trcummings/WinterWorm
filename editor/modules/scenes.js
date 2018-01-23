import { makeId } from '../../game/engine/util';
import { SCENES } from '../../game/engine/symbols';

const SELECT_SCENE = 'scenes/SELECT_SCENE';
const ADD_SCENE = 'scenes/ADD_SCENE';
// const REMOVE_SPEC = 'specs/REMOVE_SPEC';

// Selectors
export const getCurrentScene = state => state.scenes.currentScene;
export const getScenes = state => state.scenes.allScenes;

// Action Creators
export const selectScene = sceneId => ({
  type: SELECT_SCENE,
  payload: sceneId,
});

export const addNewScene = () => ({
  type: ADD_SCENE,
});

// Reducer
const INITIAL_STATE = {
  currentScene: null,
  allScenes: [],
};

export default function scenes(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case SELECT_SCENE: {
      return { ...state, currentScene: payload };
    }

    case ADD_SCENE: {
      const id = makeId(SCENES);
      const numScenes = state.allScenes.length;
      const newScene = { id, label: `New Scene ${numScenes + 1}`, systems: [] };

      return {
        currentScene: id,
        allScenes: [...state.allScenes, newScene],
      };
    }

    default: return state;
  }
}
