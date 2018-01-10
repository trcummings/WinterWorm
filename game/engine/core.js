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
  COMPONENTS,
  ENTITIES,
} from './symbols';
import {
  getCurrentScene,
  getSystemFns,
  setCurrentScene,
  setComponent,
  setScene,
  setSystem,
  setEntity,
} from './ecs';
import { nextStateAfterLoop } from './loop';
import { setRenderEngine } from './pixi';

import type { GameState, SpecType, Spec } from './types';
import type { Timestamp } from './loop';

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

// takes the type and options from the game state item, creates it, and
// adds it to the state

// takes an initial state (usually an empty object) and a spec array.
export const setGameState = (initialState: {}, ...specs: Array<Spec>) => {
  const state = specs.reduce(setState, initialState);
  const sceneId = getCurrentScene(state);

  console.log(state);

  if (!sceneId) throw new Error('Must have a CURRENT_SCENE scene in the spec!');

  // get the systems from the current scene
  const systemIds = view(lensPath([SCENES, sceneId, SYSTEMS]), state);
  const systemFns = getSystemFns(state, systemIds);

  // set a curried function to call each system function on the state
  // in order and return the next state
  const updateFn = compose(...reverse(systemFns));

  return assocPath([UPDATE_FNS, sceneId], updateFn, state);
};

export const gameLoop = (state: GameState): number => (
  window.requestAnimationFrame((timestamp: Timestamp) => (
    gameLoop(nextStateAfterLoop(state, timestamp))
  ))
);
