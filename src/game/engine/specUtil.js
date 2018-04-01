// @flow
// import uuidv4 from 'uuid/v4';
import {
  SYSTEMS,
  SCENES,
  CURRENT_SCENE,
  ENTITIES,
  SCRIPTS,
  CURRENT_CAMERA,
} from 'Symbols';

import { stateFromContract } from 'Editor/contractUtil';
import { getAssetPathAtlases } from 'Editor/aspects/AssetAtlases';
import { setSceneState } from 'Game/engine/ecs';
import {
  makeContainer,
  getRenderEngine,
  addChildMut,
} from 'Game/engine/pixi';
import componentFns from 'Game/gameObjectSpecs/componentFns';
import systemFns from 'Game/gameObjectSpecs/systemFns';
import componentStateFns from 'Game/gameObjectSpecs/componentStateFns';

const INTERACTABLE = 'interactable';
const CAMERAABLE = 'cameraable';
const POSITIONABLE = 'positionable';

const devRequirements = {
  [INTERACTABLE]: [POSITIONABLE, 'spriteRenderable'],
  [CAMERAABLE]: [POSITIONABLE],
};

const mapToLabels = gameObjects => Object.keys(gameObjects).reduce((total, id) => (
  Object.assign(total, { [gameObjects[id].label]: gameObjects[id] })
), {});

const dummyComponentStateFn = (_, cs, __, s) => [cs, s];

const toSpec = (type, options) => ({ type, options });

const getComponentStatesForEntity = (specs, entityId) => {
  const { componentStates } = specs;

  return Object.keys(componentStates).reduce((total, csId) => (
    componentStates[csId].entityId === entityId
      ? Object.assign(total, { [csId]: componentStates[csId] })
      : total
  ), {});
};

const entityHasComponent = componentLabelMap =>
  (specs, entityId, componentLabel): boolean => {
    const componentStates = getComponentStatesForEntity(specs, entityId);
    const componentId = componentLabelMap[componentLabel].id;

    return Object.keys(componentStates).some(csId => (
      componentStates[csId].componentId === componentId
    ));
  };

const addComponentState = componentLabelMap => (total, name) => {
  if (!componentLabelMap[name]) throw new Error(`no component by label of ${name}!`);
  const { id, contract = {} } = componentLabelMap[name];
  const fn = componentStateFns[name] || dummyComponentStateFn;
  const state = stateFromContract(contract || {});

  return total.concat([{ id, fn, state }]);
};

const createEntity = componentLabelMap => (id, label, componentNames) => ({
  id,
  label,
  components: componentNames.reduce(addComponentState(componentLabelMap), []),
});

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
  return { id: sceneId, label, state: {} };
};

const addComponentToEntity = (
  cLabel,
  requirements: Array<string | Array<string>>,
  componentLabelMap
) =>
  (specs, entityId) => {
    const hasComponent = entityHasComponent(componentLabelMap);
    const addCState = addComponentState(componentLabelMap);
    const isAllowed = requirements.every(label => (
      Array.isArray(label)
        ? label.some(lbl => hasComponent(specs, entityId, lbl))
        : hasComponent(specs, entityId, label)
    ));
    if (!isAllowed) return toSpec(ENTITIES, processEntity(specs, entityId));

    const { components, ...rest } = processEntity(specs, entityId);
    const options = { ...rest, components: addCState(components, cLabel) };

    return toSpec(ENTITIES, options);
  };

const organizeSystemIds = (specs) => {
  // organize systems into partitions

  const { pre, main, post } = Object.keys(specs.systems).reduce((total, sId) => {
    const { orderIndex, partition } = specs.systems[sId];
    total[partition][orderIndex] = sId; // eslint-disable-line
    return total;
  }, { pre: [], main: [], post: [] });
  return [...pre, ...main, ...post].filter(sId => specs.systems[sId].active);
};

export function gameSpecsToSpecs(specs, devCameraId) {
  const currentSceneId = Object.keys(specs.scenes)[0];
  const currentScene = processScene(specs, currentSceneId);

  // organize systems into partitions
  const systemIds = organizeSystemIds(specs);

  // build asset information to pass to the loader
  const atlases = getAssetPathAtlases();
  const initialAssetSpecs = Object.keys(atlases).map(resourceName => ({
    name: resourceName,
    path: atlases[resourceName].atlasPath,
  }));

  // add on extra functionality to assets for dev mode including
    // [x] making eligible entities interactable
    // [x] adding a dev camera & using it as the main camera
    // [x] rendering the current "main camera" as an entity that can
    //     be interacted with
  const componentLabelMap = mapToLabels(specs.components);
  const makeEntity = createEntity(componentLabelMap);

  // make dev camera
  // const devCameraId = uuidv4();
  const cameraableId = componentLabelMap[CAMERAABLE].id;
  const devCamera = toSpec(
    ENTITIES,
    makeEntity(devCameraId, 'Dev Camera', [
      POSITIONABLE,
      CAMERAABLE,
    ])
  );

  const setWorld = (state) => {
    const container = makeContainer();
    const { stage } = getRenderEngine(state);

    container.height = 500;
    container.width = 5000;

    addChildMut(stage, container);

    return setSceneState(state, currentSceneId, { world: container });
  };

  const entityIds = specs.scenes[currentSceneId].entities;
  const addInteractable = addComponentToEntity(
    INTERACTABLE,
    devRequirements[INTERACTABLE],
    componentLabelMap
  );
  const initialEntitySpecs = entityIds.map(eId => addInteractable(specs, eId));

  return {
    initialSpecs: [
      { type: SCENES,
        options: { ...currentScene, systems: systemIds } },
      { type: CURRENT_SCENE,
        options: currentSceneId },
      { type: SCRIPTS,
        options: setWorld },
      ...systemIds.map(id => ({
        type: SYSTEMS, options: processSystem(specs, id),
      })),
      devCamera,
      toSpec(CURRENT_CAMERA, [cameraableId, devCameraId]),
    ],
    initialAssetSpecs,
    initialEntitySpecs,
  };
}
