// @flow
import { view, apply, compose, assocPath, reverse, lensPath } from 'ramda';

import {
  ID,
  SCENES,
  SYSTEMS,
  CURRENT_SCENE,
  UPDATE_FNS,
} from './symbols';

import {
  currentSceneIdLens,
  getSystemFns,
  getUpdateFn,
  setCurrentScene,
  setScene,
  setSystem,
} from './ecs';

type GameStateItemType =
  | typeof SYSTEMS
  | typeof SCENES
  | typeof CURRENT_SCENE

export type Options = {
  [typeof ID]: string,
};

export type GameStateItem = [GameStateItemType, Options];

const stateItemMakers = {
  [SCENES]: setScene,
  [CURRENT_SCENE]: setCurrentScene,
  [SYSTEMS]: setSystem,
};

// takes the type and options from the game state item, creates it, and
// adds it to the state
const setStateItem = (
  state,
  [itemType, options]: GameStateItem
) => stateItemMakers[itemType](state, options);

// takes an initial state (usually an empty object) and a spec array.
export const makeGameState = (
  initialState,
  ...specs: Array<GameStateItem>
) => {
  const state = specs.reduce(setStateItem, initialState);
  const sceneId = view(currentSceneIdLens, state);

  if (!sceneId) throw new Error('Must have a CURRENT_SCENE scene in the spec!');

  // get the systems from the current scene
  const systemIds = view(lensPath([SCENES, sceneId]), state);
  const systemFns = getSystemFns(state, systemIds);

  // set a curried function to call each system function on the state
  // in order and return the next state
  const updateFn = apply(compose(...reverse(systemFns)));

  return assocPath([UPDATE_FNS, sceneId], updateFn, state);
};

export const nextState = (gameState) => {
  const updateFn = getUpdateFn(gameState);
  return updateFn(gameState);
};
