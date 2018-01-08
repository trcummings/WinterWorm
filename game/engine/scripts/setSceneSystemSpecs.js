// @flow
import { setGameState } from '../core';
import { getScene } from '../ecs';
import { SYSTEMS } from '../symbols';
import { systemMap } from '../systems';

import type { Script, Id, GameState, Spec } from '../types';

export const getSceneSystemSpecs = (state: GameState, sceneId: Id, extraSystemMap = {}) => {
  const scene = getScene(state, sceneId);

  // override system map with any other systems. Use for factory systems that need
  // to be set up and that you can't add automatically.
  const allSystems = Object.assign(systemMap, extraSystemMap);

  if (!scene) throw new Error(`Scene ${sceneId} not found in game state!`);

  return scene.systems.map((systemId: Id): Spec => {
    const system = allSystems[systemId];
    if (!system) throw new Error(`System ${systemId} not found in system map!`);
    return ({ type: SYSTEMS, options: system });
  });
};

const setSceneSystemSpecs =
  (sceneId: Id, sysMap): Script =>
    (state: GameState): GameState => {
      const systemSpecs: Array<Spec> = getSceneSystemSpecs(state, sceneId, sysMap);
      return setGameState(state, ...systemSpecs);
    };

export default setSceneSystemSpecs;
