// @flow
import { __, assoc, compose } from 'ramda';

import { clearEventQueue } from '../events';
import { setGameState } from '../core';
import { CURRENT_SCENE, SCRIPTS, COMPONENTS, ENTITIES, SYSTEMS, STATE } from '../symbols';
import { getSceneSystemSpecs } from './setSceneSystemSpecs';
import initEvents from './initEvents';

import type { Script, Id, GameState, Spec } from '../types';

const clearSceneInformation = compose(
  assoc(COMPONENTS, {}, __),
  assoc(ENTITIES, {}, __),
  assoc(SYSTEMS, {}, __),
  assoc(STATE, {}, __),
);

const changeScene =
  (sceneId: Id, ...specs: Array<Spec>): Script =>
    (state: GameState): GameState => setGameState(
      state,
      { type: CURRENT_SCENE, options: sceneId },
      { type: SCRIPTS, options: clearSceneInformation },
      { type: SCRIPTS, options: initEvents },
      ...getSceneSystemSpecs(state, sceneId),
      ...(specs || [])
    );

export default changeScene;
