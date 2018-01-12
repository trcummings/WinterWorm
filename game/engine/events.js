// @flow
// The event system distributes events to any subscribers into
// their inbox component state.

// NB: Messages should only be used for asynchronous communication.
// NB: Avoid sending messages based on recieving a message to prevent
// circular messages happening. (the same way you wouldn't dispatch from
// a reducer in Redux)

import { lensPath, assocPath, view } from 'ramda';

import { STATE, EVENTS, QUEUE, META } from './symbols';
import { getSubscribedEntityIds } from './ecs';

import type {
  GameState,
  Selectors,
  Selector,
  Action,
  Event,
  Events,
} from './types';

export const queuePath = [STATE, EVENTS, QUEUE];
export const metaPath = [STATE, EVENTS, META];


const getEvents = (path: Array<string>) => (state: GameState): Events => (
  view(lensPath(path), state)
);

export const getEventQueue = getEvents(queuePath);
export const getMetaEvents = getEvents(metaPath);

// Returns an array of events that matches the collection of selectors for an entity.
export const getSubscribedEvents = (
  eventQueue,
  entityId: string,
  subscriptions: Selectors = []
): Events => {
  const subscribedEvents = [];
  for (const eventName of subscriptions) {
    for (const event of eventQueue) {
      const isSubscribedTo = [eventName, entityId].every((item, index) => (
        event.selectors[index] === item
      ));

      if (isSubscribedTo) subscribedEvents.push(event);
    }
  }

  return subscribedEvents;
};

// Takes an action and selectors and formats them for the event representation.
// The first selector, by convention, is called the eventId. Returns an object.
export const makeEvent = (
  action: Action,
  selectors: Selectors
): Event => ({ eventId: selectors[0], selectors, action });

// Enqueues an event onto the queue
export const emitEvent = (
  state: GameState,
  action: Action,
  selectors: Selectors
): GameState => {
  const event = makeEvent(action, selectors);
  const events = getEventQueue(state);
  return assocPath(queuePath, events.concat([event]), state);
};

// Emits a collection of events at the same time. Returns updated game state.
export const emitEventsToQueue = (state: GameState, events: Events): GameState => {
  const eventQueue = getEventQueue(state);
  return assocPath(queuePath, eventQueue.concat(events), state);
};

export const emitBatchToQueue = (
  state: GameState,
  eventType: Selector,
  action: Action
): GameState => {
  const entityIds = getSubscribedEntityIds(state, eventType);
  const events = entityIds.map(id => makeEvent(action, [eventType, id]));
  return emitEventsToQueue(state, events);
};

export const clearEventQueue = (state: GameState): GameState => (
  assocPath(queuePath, [], state)
);

export const clearMetaEvents = (state: GameState): GameState => (
  assocPath(metaPath, [], state)
);

export const emitMetaEvent = (
  state: GameState,
  event: Event
): GameState => {
  const events = getMetaEvents(state);
  return assocPath(metaPath, events.concat([event]), state);
};

export const emitMetaEvents = (
  state: GameState,
  newEvents: Array<Event>
): GameState => {
  const events = getMetaEvents(state);
  return assocPath(metaPath, events.concat(newEvents), state);
};
