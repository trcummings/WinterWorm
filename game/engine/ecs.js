import { __, view, assocPath, append, lensPath, lensProp, over, dissocPath, compose, assoc } from 'ramda';

import {
  ID,
  FN,
  SYSTEMS,
  SCENES,
  ENTITIES,
  COMPONENTS,
  CURRENT_SCENE,
  STATE,
  UPDATE_FNS,
  // SUBSCRIPTIONS,
  CLEANUP_FN,
  // CONTEXT,
} from './symbols';
import { conjoin, concatKeywords } from './util';
import { getSubscribedEvents, emitEvents, getEventQueue } from './events';

//  Add or update existing scene in the game state. A scene is a
//  collection of systems. systems are a collection of keywords referencing
//  a system by their unique ID.
export const setScene = (state, scene) => (
  assocPath([SCENES, scene.id], scene, state)
);

export const getCurrentScene = state => (
  view(lensProp(CURRENT_SCENE), state)
);

// Sets current scene of the game
export const setCurrentScene = (gameState, id) => (
  assoc(CURRENT_SCENE, id, gameState)
);

export const getUpdateFn = (state) => {
  const currentSceneId = getCurrentScene(state);
  const updateFnLens = lensPath([UPDATE_FNS, currentSceneId]);
  return view(updateFnLens, state);
};

// Return array of system functions with a uId incl. in the systemIds
export const getSystemFns = (state, systemIds) => (
  systemIds.map(id => view(lensPath([SYSTEMS, id, FN]), state))
);

// Returns a Set of all entity IDs that have the specified componentId.
const getEntityIdsWithComponent = (state, componentId) => (
  view(lensPath([COMPONENTS, componentId, ENTITIES]), state)
);

// Returns a set of all entity IDs that have all the specified component-ids.
// Iterate through all the entities and only accumulate the ones
// that have all the required component IDs.
// const getMultiComponentEntityIds = (state, componentIds) => {
//   const components = new Set(componentIds);
//   const entities = view(lensPath([ENTITIES]), state);
//   const entityList = Object.keys(entities).map(eId => entities[eId]);
//
//   const helper = ([entity, ...rest], accumulator) => {
//     if (!entity) return accumulator;
//     const { [ID]: entityId, [COMPONENTS]: entityComponents } = entity;
//     const hasAllComponentIds = Object.keys(entityComponents)
//       .every(cId => components.has(cId));
//
//     if (hasAllComponentIds) accumulator.add(entityId);
//     return helper(rest, accumulator);
//   };
//
//   return helper(entityList, new Set());
// };

export const getComponent = (state, componentId) => {
  const path = lensPath([COMPONENTS, componentId]);
  return view(path, state);
};

export const setComponent = (state, component) => {
  const { id, fn } = component;

  if (!fn) throw new Error(`Component ${id} missing fn!`);

  return over(lensPath([COMPONENTS, id]), conjoin(component), state);
};

// Returns an object of state associated with the component for the given
// entityId. If not found, it returns an empty object.
export const getComponentState = (state, componentId, entityId) => (
  view(lensPath([STATE, componentId, entityId]), state)
);

export const setComponentState = (state, componentId, entityId, initialCS = {}) => (
  assocPath([STATE, componentId, entityId], initialCS, state)
);

const getComponentContext = (state, eventQueue, entityId, component) => {
  const { subscriptions, context } = component;
  const messages = getSubscribedEvents(eventQueue, entityId, subscriptions);
  if (!context) return messages;

  for (const item of context) {
    let ctxtEntityId = entityId;
    let ctxtComponentId = item;
    let assocTarget = item;
    if (item && typeof item === 'object') {
      ctxtEntityId = item.entityId;
      ctxtComponentId = item.componentId;
      assocTarget = concatKeywords(ctxtComponentId, ctxtEntityId);
    }

    const componentState = getComponentState(state, ctxtComponentId, ctxtEntityId);
    messages[assocTarget] = componentState; // eslint-disable-line
  }

  return messages;
};

// Gets all state associated with a component
const getAllComponentState = (state, componentId) => (
  view(lensPath([STATE, componentId]), state)
);

const getNextSystemStateAndEvents = (state, componentId) => {
  const entityIds = getEntityIdsWithComponent(state, componentId);
  const componentStates = getAllComponentState(state, componentId);
  const component = getComponent(state, componentId);
  const eventsQueue = getEventQueue(state);
  const newComponentState = {};
  const newEvents = [];

  for (const entityId of entityIds) {
    const componentState = componentStates[entityId];
    const context = getComponentContext(state, eventsQueue, entityId, component);
    let nextComponentState = component.fn(entityId, componentState, context);
    let events;

    // we're gonna do some mutable assignment here for performance reasons
    // this is one of the only places it should do that
    if (Array.isArray(nextComponentState)) {
      [nextComponentState, events] = nextComponentState;
      for (const event of events) newEvents.push(event);
    }
    newComponentState[entityId] = nextComponentState; // eslint-disable-line
  }

  const nextState = assocPath([STATE, componentId], newComponentState, state);
  return { nextState, events: newEvents };
};

// Returns a function representing a system that takes a single argument for
// game state.
export const setSystemFn = componentId => (state) => {
  const { nextState, events } = getNextSystemStateAndEvents(state, componentId);
  return emitEvents(nextState, events);
};

// adds the system function to state
export const setSystem = (state, system) => {
  const { id, fn, component } = system;
  if (component) {
    const componentId = component.id;
    const systemFn = setSystemFn(componentId);
    const next = assocPath([SYSTEMS, id], { id, fn: systemFn }, state);
    return setComponent(next, { id: componentId, ...component });
  }

  if (!fn) throw new Error('Invalid system spec! Missing fn');
  return assocPath([SYSTEMS, id], system, state);
};

// Returns a function that returns an updated state with component state
// generated for the given entityId. If no initial component state is given,
// it will default to an empty object.
const componentStateFromSpec = entityId => (state, component) => {
  const { id, state: componentState } = component;
  return compose(
    over(lensPath([ENTITIES, entityId]), append(id), __),
    over(lensPath([COMPONENTS, id, ENTITIES]), append(entityId), __),
    setComponentState(__, id, entityId, componentState)
  )(state);
};

export const setEntity = (state, entity) => {
  const { id, components } = entity;
  const componentStateFn = componentStateFromSpec(id);
  return components.reduce((nextState, component) => (
    componentStateFn(nextState, component)
  ), state);
};

const removeEntityFromComponentIndex = (state, entityId, componentIds) => (
  componentIds.reduce((nextState, componentId) => (
    dissocPath([COMPONENTS, componentId, ENTITIES, componentId], nextState)
  ), state)
);

export const removeEntity = (state, { [ID]: entityId }) => {
  const entity = view(lensPath([ENTITIES, entityId]), state);
  const tasks = [];

  // get all of entities' components and gather up its cleanup tasks
  for (const component of entity) {
    // if the component has a clean up task run it with the entityId
    const componentId = component.id;
    const cleanupFn = view(lensPath([COMPONENTS, componentId, CLEANUP_FN]), state);
    if (cleanupFn) tasks.push(cleanupFn(__, entityId));
  }

  // remove the entity from state
  tasks.push(dissocPath([STATE, ENTITIES, entityId], __));

  // remove the entity itself
  tasks.push(dissocPath([ENTITIES, entityId], __));

  // remove it from the component index
  tasks.push(removeEntityFromComponentIndex(__, entityId));

  // compose over the accumulated deletion tasks and call with state
  return compose(...tasks)(state);
};
