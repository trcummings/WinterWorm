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

const getEventLabel = (specs, eventTypeId) => {
  const { eventTypes: { [eventTypeId]: { label } } } = specs;
  return label;
};

const processComponent = (specs, componentId) => {
  const { components: { [componentId]: { subscriptions, context, label } } } = specs;

  return {
    label,
    context,
    id: `${componentId}`,
    fn: componentFns[label],
    subscriptions: subscriptions.map(id => getEventLabel(specs, id)),
  };
};

const processSystem = (specs, systemId) => {
  const { systems: { [systemId]: { label, componentId } } } = specs;

  if (componentId) return { id: systemId, component: processComponent(specs, componentId) };
  return { id: `${systemId}`, fn: systemFns[label] };
};

const processEntity = (specs, entityId) => {
  const { entities: { [entityId]: { label, components = [] } } } = specs;
  return { id: `${entityId}`, label, components };
};

const processScene = (specs, sceneId) => {
  const { scenes: { [sceneId]: { label } } } = specs;
  return { id: `${sceneId}`, label };
};

export function gameSpecsToSpecs(specs) {
  console.log(specs);
  const currentSceneId = Object.keys(specs.scenes)[0];
  const currentScene = processScene(specs, currentSceneId);

  const entityIds = Object.keys(specs.entities); // temporarily spoof the scene having entities
  // const entityIds = currentScene.entities;

  // const systemsByComponentIds = Object.keys(specs.systems).reduce((total, { id, componentId }) => (
  //   componentId
  //     ? Object.assign(total, { [componentId]: id })
  //     : total
  // ), {});
  //
  // const { result: sceneSystemIds } = entityIds.reduce((total, eId) => {
  //   const componentIds = (specs.entities[eId].components || []).map(({ id }) => id);
  //
  //   componentIds.forEach((cId) => {
  //     const systemId = systemsByComponentIds[cId];
  //     if (!total.memo[systemId]) {
  //       total.memo[systemId] = true; // eslint-disable-line
  //       total.result.push(systemId);
  //     }
  //   });
  //   return total;
  // }, { result: [], memo: {} });
  // const systemIdsForCurrentScene = makeSystemIdList(sceneSystemIds);

  const gameSpecs = [
    { type: SCENES,
      options: { ...currentScene, systems: Object.keys(specs.systems) } },
    { type: CURRENT_SCENE,
      options: currentSceneId },
    ...Object.keys(specs.systems).map(id => ({
      type: SYSTEMS, options: processSystem(specs, id),
    })),
    ...entityIds.map(eId => ({
      type: ENTITIES, options: processEntity(specs, eId),
    })),
  ];

  console.log(gameSpecs);

  return gameSpecs;
}
