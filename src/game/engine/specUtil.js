import {
  SYSTEMS,
  SCENES,
  CURRENT_SCENE,
  ENTITIES,
} from 'Symbols';

import componentFns from 'Game/gameObjectSpecs/componentFns';
import systemFns from 'Game/gameObjectSpecs/systemFns';

// const mapObjectsToLabel = gameObjs => Object.keys(gameObjs).reduce((total, id) => (
//   Object.assign(total, { [gameObjs[id].label]: gameObjs[id] })
// ), {});

export async function gameSpecsToSpecs(specs) {
  console.log(specs);
  const currentSceneId = Object.keys(specs.scenes)[0];
  const currentScene = specs.scenes[currentSceneId];

  console.log(componentFns);
  console.log(systemFns);

  // debugger; // eslint-disable-line

  const entityIds = Object.keys(specs.entities); // temporarily spoof the scene having entities
  // const entityIds = currentScene.entities;

  const systemsByComponentIds = Object.keys(specs.systems).reduce((total, { id, componentId }) => (
    componentId
      ? Object.assign(total, { [componentId]: id })
      : total
  ), {});

  const { result: sceneSystemIds } = entityIds.reduce((total, eId) => {
    const componentIds = (specs.entities[eId].components || []).map(({ id }) => id);

    componentIds.forEach((cId) => {
      const systemId = systemsByComponentIds[cId];
      if (!total.memo[systemId]) {
        total.memo[systemId] = true; // eslint-disable-line
        total.result.push(systemId);
      }
    });
    return total;
  }, { result: [], memo: {} });
  // const systemIdsForCurrentScene = makeSystemIdList(sceneSystemIds);

  return [
    { type: SCENES,
      options: { ...currentScene, systems: sceneSystemIds } },
    { type: CURRENT_SCENE,
      options: specs.currentScene },
    ...sceneSystemIds.map(id => ({
      type: SYSTEMS, options: specs.systems[id],
    })),
    ...entityIds.map(eId => ({
      type: ENTITIES, options: specs.entities[eId],
    })),
  ];
}
