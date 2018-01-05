import { view, assocPath, lensPath, lensProp, over, dissocPath, compose, assoc } from 'ramda';

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
import { getSubscribedEvents, emitEvents, queueLens } from './events';

//  Add or update existing scene in the game state. A scene is a
//  collection of systems. systems are a collection of keywords referencing
//  a system by their unique ID.
export const setScene = (state, scene) => (
  assocPath([SCENES, scene.id], scene, state)
);

export const currentSceneIdLens = lensProp(CURRENT_SCENE);
export const getCurrentSceneId = gameState => view(currentSceneIdLens, gameState);

export const getUpdateFn = (gameState) => {
  const currentSceneId = getCurrentSceneId(gameState);
  const updateFnLens = lensPath([UPDATE_FNS, currentSceneId]);
  return view(updateFnLens, gameState);
};

// Sets current scene of the game
export const setCurrentScene = (gameState, id) => (
  assoc(CURRENT_SCENE, id, gameState)
);

// Return array of system functions with a uId incl. in the systemIds
export const getSystemFns = (state, systemIds) => (
  systemIds
    .map(id => view(lensPath([SYSTEMS, id, FN]), state))
    .filter(fn => fn) // filter out undefineds
);

// Returns a Set of all entity IDs that have the specified componentId.
export const getEntityIdsWithComponent = (
  state,
  componentId
) => {
  const entities = view([COMPONENTS, componentId, ENTITIES], state);
  return new Set(Object.keys(entities));
};

// Returns a set of all entity IDs that have all the specified component-ids.
// Iterate through all the entities and only accumulate the ones
// that have all the required component IDs.
export const getMultiComponentEntityIds = (state, componentIds) => {
  const components = new Set(componentIds);
  const entities = view(lensPath([ENTITIES]), state);
  const entityList = Object.keys(entities).map(eId => entities[eId]);

  const helper = ([entity, ...rest], accumulator) => {
    if (!entity) return accumulator;
    const { [ID]: entityId, [COMPONENTS]: entityComponents } = entity;
    const hasAllComponentIds = Object.keys(entityComponents)
      .every(cId => components.has(cId));

    if (hasAllComponentIds) accumulator.add(entityId);
    return helper(rest, accumulator);
  };

  return helper(entityList, new Set());
};

export const getComponent = (state, componentId) => {
  const path = lensPath([COMPONENTS, componentId]);
  return view(path, state);
};

// Returns an object of state associated with the component for the given
// entityId. If not found, it returns an empty object.
export const getComponentState = (state, componentId, entityId) => {
  const path = lensPath([STATE, componentId, entityId]);
  return view(path, state) || {};
};

// Gets all state associated with a component
export const getAllComponentState = (state, componentId) => {
  const path = lensPath([STATE, componentId]);
  return view(path, state);
};

export const setComponentState = (state, componentId, entityId, initialComponentState = {}) => {
  const path = [STATE, componentId, entityId];
  return assocPath(path, initialComponentState, state);
};

// Returns an updated object hashmap with the given component.
//    Args:
//    - state: global state object
//    - options: object containing
//       Required component options
//       - uid: unique identifier for this component
//       - fn: function component calls with the component state
//       Supported component options:
//       - subscriptions: an of array of messages to receive.
//         This will be included as a sequence in the context passed to the
//         component fn in the :inbox key
//       - context: a collection of component IDs of additional state
//         to select which will be available in the context key of
//         the context passed to the component fn
//       - cleanupFn: called when removing the entity and all it's components.
//         This should perform any other cleanup or side effects needed to remove
//         the component and all of it's state completely"
export const setComponent = (state, component) => {
  const { id, fn } = component;

  if (!fn) throw new Error(`Component ${id} missing fn!`);

  const path = lensPath([COMPONENTS, id]);

  return over(path, conjoin(component), state);
};

const getComponentContext = (state, eventsQueue, entityId, component) => {
  const { subscriptions, context } = component;
  const messages = getSubscribedEvents(eventsQueue, entityId, subscriptions);

  const getContextHelper = ([componentId, ...restIds], thisContext) => {
    if (!componentId) return thisContext;
    let thisComponentId = componentId;
    let thisEntityId = entityId;
    let assocTarget = componentId;
    if (Array.isArray(componentId)) {
      [thisComponentId, thisEntityId] = componentId;
      assocTarget = concatKeywords(thisComponentId, thisEntityId);
    }

    const componentState = getComponentState(state, thisComponentId, thisEntityId);

    // we're gonna do some mutable assignment here for performance reasons
    // this is one of the only places it should do that
    thisContext[assocTarget] = componentState; // eslint-disable-line

    return getContextHelper(restIds, thisContext);
  };

  return getContextHelper(context, messages);
};

const systemNextStateAndEvents = (state, componentId) => {
  const entityIds = getEntityIdsWithComponent(state, componentId);
  const componentStates = getAllComponentState(state, componentId);
  const component = getComponent(state, componentId);
  const componentFn = component[FN];
  const eventsQueue = view(queueLens, state);

  const helper = ([entityId, ...restIds], stateAccumulator, eventAccumulator) => {
    if (!entityId) return [stateAccumulator, eventAccumulator];

    const componentState = componentStates[entityId];
    const context = getComponentContext(state, eventsQueue, entityId, component);
    let nextComponentState = componentFn(entityId, componentState, context);
    let events;

    if (Array.isArray(nextComponentState)) {
      [nextComponentState, events] = nextComponentState;
      events.forEach(event => eventAccumulator.push(event));
    }

    // we're gonna do some mutable assignment here for performance reasons
    // this is one of the only places it should do that
    stateAccumulator[entityId] = nextComponentState; // eslint-disable-line

    return helper(restIds, stateAccumulator, eventAccumulator);
  };

  const [newState, newEvents] = helper(entityIds, {}, []);
  const update = newEvents.length > 0 ? [newState, newEvents] : newState;

  return assocPath([STATE, componentId], update, state);
};

// Returns a function representing a system that takes a single argument for
// game state.
export const setSystemFn = componentId => (state) => {
  const [nextState, events] = systemNextStateAndEvents(state, componentId);
  return emitEvents(nextState, events);
};

// adds the system function to state
export const setSystem = (state, system) => {
  const { id, fn, component } = system;
  if (component) {
    const componentId = component.id;
    const systemFn = setSystemFn(componentId);
    const next = assocPath([SYSTEMS, id], systemFn, state);
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
    s => over(lensPath([ENTITIES, entityId]), conjoin(id), s),
    s => over(lensPath([COMPONENTS, id, ENTITIES]), conjoin(id), s),
    s => setComponentState(s, id, entityId, componentState)
  )(state);
};

export const setEntity = (state, entity) => {
  const { id, components } = entity;
  const componentStateFn = componentStateFromSpec(id);
  return components.reduce((nextState, component) => (
    componentStateFn(state, component)
  ), state);
};

const removeEntityFromComponentIndex = (state, entityId, componentIds) => (
  componentIds.reduce((nextState, componentId) => (
    dissocPath([COMPONENTS, componentId, ENTITIES, componentId], nextState)
  ), state)
);

export const removeEntity = (state, { [ID]: entityId }) => {
  const path = lensPath([ENTITIES, entityId]);
  const entity = view(path, state);
  const tasks = [];

  // get all of entities' components and gather up its cleanup tasks
  for (const component of entity) {
    // if the component has a clean up task run it with the entityId
    const componentId = component.id;
    const cleanupFnLens = lensPath([COMPONENTS, componentId, CLEANUP_FN]);
    const cleanupFn = view(cleanupFnLens, state);
    if (cleanupFn) tasks.push(s => cleanupFn(s, entityId));
  }

  // remove the entity from state
  tasks.push(s => dissocPath([STATE, ENTITIES, entityId], s));

  // remove the entity itself
  tasks.push(s => dissocPath([ENTITIES, entityId], s));

  // remove it from the component index
  tasks.push(s => removeEntityFromComponentIndex(s, entityId));

  // compose over the accumulated deletion tasks and call with state
  return compose(...tasks)(state);
};
