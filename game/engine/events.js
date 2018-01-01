// @flow

// EVENT BUS

// Anyone can send a message to the event bus.
// The event system distributes the events to any subscribers into
// their inbox component state.
// Events are tuples of event keyword, the sender, and message object.
// Messages should only be used for asynchronous communication.
// Avoid sending messages based on recieving a message to prevent
// circular messages happening.
// Needs to be globally accessible to all systems and component
// functions.

// How do we do this without a singleton?
// Update the component function to get the component state and it's
// mailbox. Mailboxes are per entity/component.
// Add a function to add a subscription for a given
// event/entity/component id
import { merge, lensPath, assocPath, concat, view, over, into } from 'ramda';

import { STATE, EVENTS, QUEUE } from './symbols';
import type { GameState } from './gameState';


type Selector = string;
type Selectors = Array<Selector>;
type Action = {};
type Event = {
  eventId: string,
  selectors: Selectors,
  action: Action
};
type Events = Array<Event>;


const conjoin = arg1 => arg2 => merge(arg2, arg1);
export const queuePath = [STATE, EVENTS, QUEUE];
export const queueLens = lensPath([STATE, EVENTS, QUEUE]);

// Returns a collection of events.
export const getEvents = (queue, selectors: Selectors) => view(selectors, queue);

// Returns an array of events that matches the collection of selectors for an entity.
export const getSubscribedEvents = (queue, entityId: string, selectors: Selectors): Events => {
  const getSubscribedEventsHelper = ([selector, ...restSelectors], accumulator) => {
    if (!selector) return accumulator;

    // implicitly add the entityId to tne end of the selector, ensuring
    // messages are only for the entity in question
    const events = view([selector, entityId], queue);
    const helperHelper = ([event, ...restEvents], helperAccumulator) => {
      if (!event) return helperAccumulator;
      return helperHelper(restEvents, helperAccumulator.concat([event]));
    };
    return getSubscribedEventsHelper(restSelectors, helperHelper(events, accumulator));
  };

  return getSubscribedEventsHelper(selectors, []);
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
  gameState: GameState,
  action: Action,
  selectors: Selectors
): GameState => {
  const event = makeEvent(action, selectors);
  const path = into(queuePath, concat, selectors);

  return over(path, conjoin(event), gameState);
};

// Emits a collection of events at the same time. Returns updated game state.
export const emitEvents = (gameState: GameState, events: Events): GameState => {
  const allQueues = view(queueLens, gameState);
  const emitEventsHelper = (queues, [event, ...rest]) => {
    if (!event) return queues;
    const { selectors } = event;
    const update = over(selectors, conjoin(event), queues);
    return emitEventsHelper(update, rest);
  };
  const update = emitEventsHelper(allQueues, events);

  return assocPath(queueLens, update, gameState);
};

// Batch add events with the same selectors. Events should be a hashmap of id,
// collection of valid events. Will merge existing events map with
// eventsMap, overwriting existing keys
export const batchEmitEvents = (gameState: GameState, selectors: Selectors, eventsMap) => {
  const path = into(queuePath, concat, selectors);
  const existingEvents = view(path, gameState);
  const events = merge(existingEvents, eventsMap);

  return assocPath(path, events, gameState);
};

// Resets event queue to an empty object. Returns updated state.
export const clearEventsQueue = (gameState: GameState) =>
  assocPath(queueLens, {}, gameState);
