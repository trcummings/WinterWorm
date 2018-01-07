// @flow
// The event system distributes events to any subscribers into
// their inbox component state.

// NB: Messages should only be used for asynchronous communication.
// NB: Avoid sending messages based on recieving a message to prevent
// circular messages happening. (the same way you wouldn't dispatch from
// a reducer in Redux)

import { lensPath, assocPath, view } from 'ramda';

import { STATE, EVENTS, QUEUE } from './symbols';

import type { GameState } from './types';

type Selector = string;
type Selectors = Array<Selector>;
type Action = {};
type Event = {
  eventId: string,
  selectors: Selectors,
  action: Action
};
type Events = Array<Event>;

export const queuePath = [STATE, EVENTS, QUEUE];

export const getEventQueue = (state: GameState): Events => (
  view(lensPath(queuePath), state)
);

// Returns a collection of events.
export const getEvents = (queue, selectors: Selectors) => (
  view(lensPath(selectors), queue)
);

// Returns an array of events that matches the collection of selectors for an entity.
export const getSubscribedEvents = (
  eventQueue,
  entityId: string,
  subscriptions: Selectors = []
): Events => {
  const subscribedEvents = {};
  for (const eventName of subscriptions) {
    subscribedEvents[eventName] = [];
    const events = getEvents(eventQueue, [eventName, entityId]);
    if (events) for (const event of events) subscribedEvents[eventName].push(event);
  }
  return subscribedEvents;
};

// Takes an action and selectors and formats them for the event representation.
// The first selector, by convention, is called the eventId. Returns an object.
export const makeEvent = (action: Action, selectors: Selectors): Event => ({
  eventId: selectors[0],
  selectors,
  action,
});

// Enqueues an event onto the queue
export const emitEvent = (
  state: GameState,
  action: Action,
  selectors: Selectors
): GameState => {
  const event = makeEvent(action, selectors);
  const path = queuePath.concat(selectors);
  const events = view(lensPath(path), state) || [];

  return assocPath(path, events.concat([event]), state);
};

// Emits a collection of events at the same time. Returns updated game state.
export const emitEvents = (state: GameState, events: Events): GameState => {
  let update;
  const eventQueue = getEventQueue(state);
  const eventNames = Object.keys(eventQueue);

  for (const eventName of eventNames) {
    const eventsForEventName = eventQueue[eventName] || [];

    for (const event of eventsForEventName) {
      const newEvents = eventsForEventName.concat([event]);
      update = assocPath(event.selectors, newEvents, events);
    }
  }

  if (!update) return state;
  return assocPath(queuePath, update, state);
};

export const clearEventQueue = (state: GameState): GameState => (
  assocPath(queuePath, {}, state)
);
