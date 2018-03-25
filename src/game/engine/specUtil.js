// @flow
import {
  SYSTEMS,
  SCENES,
  CURRENT_SCENE,
  ENTITIES,
} from 'Symbols';

import { stateFromContract } from 'Editor/contractUtil';
import { getAssetPathAtlases } from 'Editor/aspects/AssetAtlases';
import componentFns from 'Game/gameObjectSpecs/componentFns';
import systemFns from 'Game/gameObjectSpecs/systemFns';
import componentStateFns from 'Game/gameObjectSpecs/componentStateFns';

const mapToLabels = gameObjects => Object.keys(gameObjects).reduce((total, id) => (
  Object.assign(total, { [gameObjects[id].label]: gameObjects[id] })
), {});

const dummyComponentStateFn = (_, cs, __, s) => [cs, s];

const entityHasComponent = (specs, entityId, componentLabel): boolean => {
  const {
    components,
    entities: { [entityId]: { components: entityComponents } },
  } = specs;
  const componentLabelMap = mapToLabels(components);
  const componentId = componentLabelMap[componentLabel].id;

  return entityComponents.some(({ id }) => id === componentId);
};

const addComponentState = componentLabelMap => (total, name) => {
  if (!componentLabelMap[name]) throw new Error(`no component by label of ${name}!`);
  const { id, contract = {} } = componentLabelMap[name];
  const fn = componentStateFns[name] || dummyComponentStateFn;
  const state = stateFromContract(contract);

  return total.concat([{ id, fn, state }]);
};

const createEntity = (specs, label, componentNames) => {
  const { components } = specs;
  const componentLabelMap = mapToLabels(components);
  const componentStateFn = addComponentState(componentLabelMap);

  return { label, components: componentNames.reduce(componentStateFn, []) };
};

const getEventLabel = (specs, eventTypeId) => {
  const { eventTypes: { [eventTypeId]: { label } } } = specs;
  return label;
};

const processComponent = (specs, componentId) => {
  const { components: { [componentId]: { subscriptions, contexts, label } } } = specs;

  return {
    label,
    context: contexts,
    id: componentId,
    fn: componentFns[label],
    subscriptions: subscriptions.map(id => getEventLabel(specs, id)),
  };
};

const processSystem = (specs, systemId) => {
  const { systems: { [systemId]: { label, componentId } } } = specs;

  if (componentId) return { id: systemId, component: processComponent(specs, componentId) };
  return { id: systemId, fn: systemFns[label], label };
};

const processEntity = (specs, entityId) => {
  const { entities: { [entityId]: { label } }, componentStates = {}, components } = specs;

  const eComponents = Object.keys(componentStates).reduce((total, csId) => {
    const { entityId: cseId, active, state, componentId } = componentStates[csId];
    if (cseId !== entityId || !active) return total;

    const { [componentId]: { label: cLabel } } = components;
    const fn = componentStateFns[cLabel] || dummyComponentStateFn;

    return total.concat([{ id: componentId, fn, state }]);
  }, []);

  return { id: entityId, label, components: eComponents };
};

const processScene = (specs, sceneId) => {
  const { scenes: { [sceneId]: { label } } } = specs;
  return { id: sceneId, label };
};

export function gameSpecsToSpecs(specs) {
  const currentSceneId = Object.keys(specs.scenes)[0];
  const currentScene = processScene(specs, currentSceneId);
  const entityIds = specs.scenes[currentSceneId].entities;


  // organize systems into partitions
  const { pre, main, post } = Object.keys(specs.systems).reduce((total, sId) => {
    const { orderIndex, partition } = specs.systems[sId];
    total[partition][orderIndex] = sId; // eslint-disable-line
    return total;
  }, { pre: [], main: [], post: [] });
  const systemIds = [...pre, ...main, ...post].filter(sId => specs.systems[sId].active);

  // build asset information to pass to the loader
  const atlases = getAssetPathAtlases();
  const assetSpecs = Object.keys(atlases).map(resourceName => ({
    name: resourceName,
    path: atlases[resourceName].atlasPath,
  }));

  return {
    initialSpecs: [
      { type: SCENES,
        options: { ...currentScene, systems: systemIds } },
      { type: CURRENT_SCENE,
        options: currentSceneId },
      ...systemIds.map(id => ({
        type: SYSTEMS, options: processSystem(specs, id),
      })),
    ],
    initialAssetSpecs: assetSpecs,
    initialEntitySpecs: entityIds.map(eId => ({
      type: ENTITIES, options: processEntity(specs, eId),
    })),
  };
}
