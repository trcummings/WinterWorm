// ;; Anyone can send a message to the event bus
// ;; The event system distributes the events to any subscribers into
// ;; their inbox component state
// ;; Events are tuples of event keyword, the sender, and message hm
// ;; Messages should only be used for asynchronous communication
// ;; Avoid sending messages based recieving a message to prevent
// ;; circular messages happening
//
// ;; This needs to be globally accessible to all systems and component
// ;; functions
//
// ;; How do we do this without a singleton?
// ;; Update the component function to get the component state and it's
// ;; mailbox. Mailboxes are per entity/component.
// ;; Add a function to add a subscription for a given
// ;; event/entity/component id
import R from 'ramda';

const conjoin = arg => R.merge(R._, arg);
const queuePath = R.lensPath(['state', 'events', 'queue']);

// Returns a collection of events.
export const getEvents = (queue, selectors) => R.view(selectors, queue);

// Returns an array of events that matches the collection of selectors.
export const getSubscribedEvents = (queue, entityId, selectors) => {
  const getSubscribedEventsHelper = ([selector, ...restSelectors], accumulator) => {
    if (!selector) return accumulator;

    const events = R.view([selector, entityId], queue);
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
export const makeEvent = (action, selectors) => ({
  eventId: selectors[0],
  selectors,
  action,
});

// Enqueues an event onto the queue"
export const emitEvent = (gameState, action, selectors) => {
  const event = makeEvent(action, selectors);
  const path = R.into(queuePath, selectors);

  return R.over(path, conjoin(event), gameState);
};

// Emits a collection of events at the same time. Returns updated game state.
export const emitEvents = (gameState, events) => {
  const allQueues = R.view(queuePath, gameState);
  const emitEventsHelper = (queues, [event, ...rest]) => {
    if (!event) return queues;
    const { selectors } = event;
    const update = R.over(selectors, conjoin(event), queues);
    return emitEventsHelper(update, rest);
  };
  const update = emitEventsHelper(allQueues, events);

  return R.assocPath(queuePath, update, gameState);
};

//  Batch add events with the same selectors. Events should be a hashmap of id,
//  collection of valid events. Will merge existing events map with
//  eventsMap, overwriting existing keys
export const batchEmitEvents = (gameState, selectors, eventsMap) => {
  const path = R.into(queuePath, selectors);
  const existingEvents = R.view(path, gameState);
  return R.assocPath(path, R.merge(existingEvents, eventsMap), gameState);
};

// Resets event queue to an empty object. Returns updated state.
export const clearEventsQueue = gameState => R.assocPath(queuePath, {}, gameState);
