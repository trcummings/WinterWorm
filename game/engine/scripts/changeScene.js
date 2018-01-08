// @flow
import { __, lensProp, assoc, compose } from 'ramda';

import { clearEventQueue } from '../events';
import { getScene } from '../ecs';
import { setGameState } from '../core';
import { systemMap } from '../systems';
import { CURRENT_SCENE, SCRIPTS, COMPONENTS, ENTITIES, SYSTEMS, STATE } from '../symbols';

import type { Script, ID as Id, GameState, Spec } from '../types';

const clearStateInformation = (state: GameState): State => compose(
  assoc(lensProp(COMPONENTS), {}, __),
  assoc(lensProp(ENTITIES), {}, __),
  assoc(lensProp(SYSTEMS), {}, __),
  assoc(lensProp(STATE), {}, __),
)(state);

const changeScene =
  (sceneId: Id, ...specs: Array<Spec>): Script =>
    (state: GameState): GameState => {
      console.log('changing scene!');

      const { systems } = getScene(state, sceneId);
      const systemSpecs = systems.map((systemId: Id) => ({
        type: SYSTEMS, options: systemMap[systemId],
      }));

      return setGameState(
        state,
        { type: SCRIPTS, options: clearEventQueue },
        { type: SCRIPTS, options: clearStateInformation },
        { type: CURRENT_SCENE, options: sceneId },
        ...systemSpecs,
        ...specs
      );
    };

export default changeScene;
