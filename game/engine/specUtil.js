import {
  SYSTEMS,
  SCENES,
  CURRENT_SCENE,
  ENTITIES,
} from './symbols';

import preCoreDevOnlySystems from './systems/preCoreDevOnlySystems';
import coreSystems from './systems/coreSystems';
import renderSystems from './systems/renderSystems';
import postRenderDevOnlySystems from './systems/postRenderDevOnlySystems';
import gameEditorSystems from './systems/gameEditorSystems';

const systemList = [
  ...preCoreDevOnlySystems,
  ...coreSystems,
  ...gameEditorSystems,
  ...renderSystems,
  ...postRenderDevOnlySystems,
];

const makeSystemIdList = (...userDefinedSystemIds) => ([
  ...preCoreDevOnlySystems.map(({ id }) => id),
  ...coreSystems.map(({ id }) => id),
  ...userDefinedSystemIds,
  ...renderSystems.map(({ id }) => id),
  ...postRenderDevOnlySystems.map(({ id }) => id),
]);

// const systemIds = systemList.map(({ id }) => id);

const systemMap = systemList.reduce((total, system) => (
  Object.assign(total, { [system.id]: system })
), {});

const systemsByComponentIds = systemList.reduce((total, { id, component }) => {
  if (!component) return total;
  return Object.assign(total, { [component.id]: id });
}, {});

export function gameSpecsToSpecs(specs) {
  const currentSceneId = specs.currentScene;
  const currentScene = specs.scenes[currentSceneId];

  // debugger; // eslint-disable-line

  const entityIds = Object.keys(specs.entities); // temporarily spoof the scene having entities
  // const entityIds = currentScene.entities;

  const { result: sceneSystemIds } = entityIds.reduce((total, eId) => {
    const componentIds = specs.entities[eId].components.map(({ id }) => id);
    componentIds.forEach((cId) => {
      const systemId = systemsByComponentIds[cId];
      if (!total.memo[systemId]) {
        total.memo[systemId] = true; // eslint-disable-line
        total.result.push(systemId);
      }
    });
    return total;
  }, { result: [], memo: {} });
  const systemIdsForCurrentScene = makeSystemIdList(sceneSystemIds);

  return [
    { type: SCENES,
      options: { ...currentScene, systems: systemIdsForCurrentScene } },
    { type: CURRENT_SCENE,
      options: specs.currentScene },
    ...systemIdsForCurrentScene.map(id => ({
      type: SYSTEMS, options: systemMap[id],
    })),
    ...entityIds.map(eId => ({
      type: ENTITIES, options: specs.entities[eId],
    })),
  ];
}
