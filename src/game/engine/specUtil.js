import {
  SYSTEMS,
  SCENES,
  CURRENT_SCENE,
  ENTITIES,
} from 'Symbols';

import componentFns from 'Game/gameObjectSpecs/componentFns';
import systemFns from 'Game/gameObjectSpecs/systemFns';
// import componentStateFns from 'Game/gameObjectSpecs/componentStateFns';

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
  const currentSceneId = Object.keys(specs.scenes)[0];
  const currentScene = processScene(specs, currentSceneId);

  const entityIds = Object.keys(specs.entities); // temporarily spoof the scene having entities

  return [
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
}
