import {
  SYSTEMS,
  SCENES,
  CURRENT_SCENE,
  ENTITIES,
} from 'Symbols';

import { getAssetPathAtlases } from 'Editor/aspects/AssetAtlases';
import componentFns from 'Game/gameObjectSpecs/componentFns';
import systemFns from 'Game/gameObjectSpecs/systemFns';
import componentStateFns from 'Game/gameObjectSpecs/componentStateFns';

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

    // const { [componentId]: { isFactory, label: cLabel, contexts = [] } } = components;
    const { [componentId]: { isFactory, label: cLabel } } = components;
    if (!isFactory) return total.concat([{ id: componentId, state }]);

    const fn = componentStateFns[cLabel];
    // const initContexts = contexts.reduce((total2, cId) => {
    //   const cState = total.find(({ id }) => id === cId);
    //   if (!cState) return total2;
    //   const { [cId]: { label: cLabel2 } } = components;
    //   return Object.assign(total2, { [cLabel2]: cState.state });
    // }, {});

    // return total.concat([{ id: componentId, fn: fn(cseId, state, initContexts) }]);
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

  const { pre, main, post } = Object.keys(specs.systems).reduce((total, sId) => {
    const { orderIndex, partition } = specs.systems[sId];
    total[partition][orderIndex] = sId; // eslint-disable-line
    return total;
  }, { pre: [], main: [], post: [] });
  const systemIds = [...pre, ...main, ...post].filter(sId => specs.systems[sId].active);

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
