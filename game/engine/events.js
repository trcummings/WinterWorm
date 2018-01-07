// @flow
// The event system distributes events to any subscribers into
// their inbox component state.

// NB: Messages should only be used for asynchronous communication.
// NB: Avoid sending messages based on recieving a message to prevent
// circular messages happening. (the same way you wouldn't dispatch from
// a reducer in Redux)

import { lensPath, assocPath, view, over } from 'ramda';

import { STATE, EVENTS, QUEUE } from './symbols';
import { conjoin } from './util';

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
  const subscribedEvents = [];
  for (const eventName of subscriptions) {
    for (const event of eventQueue) {
      const isSubscribedTo = [eventName, entityId].every((item, index) => (
        event.selectors[index] === item
      ));

      if (isSubscribedTo) subscribedEvents.push(event.action);
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
export const emitEvents = (state: GameState, events: Events): GameState => {
  const eventQueue = getEventQueue(state);
  return assocPath(queuePath, eventQueue.concat(events), state);
};

export const clearEventQueue = (state: GameState): GameState => (
  assocPath(queuePath, [], state)
);
