// @flow
import { __, lensProp, assoc, compose } from 'ramda';

import { clearEventQueue } from '../events';
import { setGameState } from '../core';
import { CURRENT_SCENE, SCRIPTS, COMPONENTS, ENTITIES, SYSTEMS, STATE } from '../symbols';
import { getSceneSystemSpecs } from './setSceneSystemSpecs';

import type { Script, Id, GameState, Spec } from '../types';

const clearSceneInformation = (state: GameState): State => compose(
  assoc(lensProp(COMPONENTS), {}, __),
  assoc(lensProp(ENTITIES), {}, __),
  assoc(lensProp(SYSTEMS), {}, __),
  assoc(lensProp(STATE), {}, __),
)(state);

const changeScene =
  (sceneId: Id, ...specs: Array<Spec>): Script =>
    (state: GameState): GameState => {
      console.log('changing scene!');

      const systemSpecs = getSceneSystemSpecs(state, sceneId);

      return setGameState(
        state,
        { type: SCRIPTS, options: clearEventQueue },
        { type: SCRIPTS, options: clearSceneInformation },
        { type: CURRENT_SCENE, options: sceneId },
        ...systemSpecs,
        ...specs
      );
    };

export default changeScene;
