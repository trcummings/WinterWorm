// @flow
import { view, compose, assocPath, reverse, lensPath } from 'ramda';
import CircularJSON from 'circular-json';

import {
  SCENES,
  SYSTEMS,
  CURRENT_SCENE,
  UPDATE_FNS,
  SCRIPTS,
  RENDER_ENGINE,
  PHYSICS_ENGINE,
  CURRENT_CAMERA,
  COMPONENTS,
  ENTITIES,
  ID_RECORD,
} from './symbols';
import {
  getCurrentScene,
  getSystemFns,
  setCurrentScene,
  setComponent,
  setScene,
  setSystem,
  setEntity,
  setIdRecord,
} from './ecs';
import { setRenderEngine, setCurrentCameraId } from './pixi';
import { setPhysicsEngine } from './planck';

import type { GameState, SpecType, Spec } from './types';

const applySpec = specFn => (state: GameState, { options }): GameState => (
  specFn(state, options)
);

const setStateFn = (type: SpecType) => {
  switch (type) {
    case ENTITIES: { return applySpec(setEntity); }
    case COMPONENTS: { return applySpec(setComponent); }
    case SYSTEMS: { return applySpec(setSystem); }
    case SCENES: { return applySpec(setScene); }
    case CURRENT_SCENE: { return applySpec(setCurrentScene); }
    case RENDER_ENGINE: { return applySpec(setRenderEngine); }
    case PHYSICS_ENGINE: { return applySpec(setPhysicsEngine); }
    case ID_RECORD: { return applySpec(setIdRecord); }
    case CURRENT_CAMERA: { return applySpec(setCurrentCameraId); }
    case SCRIPTS: {
      return (state: GameState, { options }): GameState => {
        const fn = options;
        if (!fn) throw Error('missing fn in spec for script!');
        return fn(state);
      };
    }
    default: {
      return (_: GameState, ...args) => {
        throw new Error(`Could not dispatch: ${CircularJSON.stringify(args)}`);
      };
    }
  }
};

// takes the type and options from the game state item, creates it, and
// adds it to the state
export const setState = (state: GameState, spec: Spec): GameState => {
  const { type } = spec;
  const stateFn = setStateFn(type);
  return stateFn(state, spec);
};

export const getUpdateFn = (
  state: GameState,
  systemIds: Array<Id>,
) => {
  const systemFns = getSystemFns(state, systemIds);
  // make a curried function to call each system function on the state
  // in order and return the next state
  return compose(...reverse(systemFns));
};

export const getSceneSystemIds = (state: GameState): [Array<Id>, Id] => {
  const sceneId = getCurrentScene(state);
  if (!sceneId) throw new Error('Must have a CURRENT_SCENE scene in the spec!');

  // get the systemIds from the current scene to get the update fn
  return [view(lensPath([SCENES, sceneId, SYSTEMS]), state), sceneId];
};

export const applySpecs = (initialState: {}, ...specs: Array<Spec>) => (
  specs.reduce(setState, initialState)
);

// takes an initial state (usually an empty object) and a spec array.
export const setGameState = (initialState: {}, ...specs: Array<Spec>) => {
  const state = applySpecs(initialState, ...specs);

  // get the systemIds from the current scene to get the update fn
  const [systemIds, sceneId] = getSceneSystemIds(state);
  const updateFn = getUpdateFn(state, systemIds);

  return assocPath([UPDATE_FNS, sceneId], updateFn, state);
};
