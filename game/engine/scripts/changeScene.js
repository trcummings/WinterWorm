// @flow
import { __, assoc, compose, pick } from 'ramda';

import { setGameState, setState } from '../core';
import { CURRENT_SCENE, SCRIPTS, COMPONENTS, SYSTEMS, EVENTS, STATE, GAME_LOOP, LOADERS } from '../symbols';
import { getSceneSystemSpecs } from './setSceneSystemSpecs';
import removeAllEntities from './removeAllEntities';

import type { Script, Id, GameState, Spec } from '../types';

const clearState = (ignore: Array<string>) => (state: GameState): GameState => {
  const picked = pick(ignore, state);
  return assoc(STATE, picked, state);
};

const clearSceneInformation = compose(
  assoc(COMPONENTS, {}, __),
  assoc(SYSTEMS, {}, __),
  clearState([EVENTS, GAME_LOOP, LOADERS]),
);

const changeScene =
  (sceneId: Id, ...specs: Array<Spec>): Script =>
    (state: GameState): GameState => {
      const newSceneSpecs = [
        { type: SCRIPTS, options: removeAllEntities },
        { type: SCRIPTS, options: clearSceneInformation },
        { type: CURRENT_SCENE, options: sceneId },
        ...getSceneSystemSpecs(state, sceneId),
      ];

      const next = newSceneSpecs.reduce(setState, state);
      return setGameState(next, ...specs);
    };

export default changeScene;
