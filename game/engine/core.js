// @flow
import { view, compose, assocPath, reverse, lensPath } from 'ramda';

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
  getCurrentSceneId,
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

const setStateFn = (type: SpecType) => {
  switch (type) {
    case ENTITIES: {
      return (state: GameState, { options }): GameState => (
        setEntity(state, options)
      );
    }
    case COMPONENTS: {
      return (state: GameState, { options }): GameState => (
        setComponent(state, options)
      );
    }
    case SCRIPTS: {
      return (state: GameState, { options }): GameState => {
        const { fn } = options;
        if (!fn) throw Error('missing fn in spec for script!');
        return fn(state);
      };
    }
    case SYSTEMS: {
      return (state: GameState, { options }): GameState => (
        setSystem(state, options)
      );
    }
    case SCENES: {
      return (state: GameState, { options }): GameState => (
        setScene(state, options)
      );
    }
    case CURRENT_SCENE: {
      return (state: GameState, { options }): GameState => (
        setCurrentScene(state, options)
      );
    }
    case RENDER_ENGINE: {
      return (state: GameState, { options }): GameState => (
        setRenderEngine(state, options)
      );
    }
    default: {
      return (_: GameState, ...args) => {
        throw new Error(`Could not dispatch: ${args}`);
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
  const sceneId = getCurrentSceneId(state);

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
