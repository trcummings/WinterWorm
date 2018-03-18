import { KEYBOARD_INPUT } from 'Engine/symbols';
import { hasEventInInbox, makeEvent } from 'Engine/events';

// this component takes keyboard input and turns it into events for the
// same entity based on a mapping passed in initially
export default (entityId, componentState, context) => {
  const { inbox } = context;
  const input = hasEventInInbox(KEYBOARD_INPUT)(inbox);

  if (!input) return componentState;

  const { inputEventMap } = componentState;
  const inputEvents = Object.keys(input).reduce((events, key) => {
    let newEvents;
    if (!inputEventMap[key]) return events;
    else if (Array.isArray(inputEventMap[key])) newEvents = inputEventMap[key];
    else newEvents = [inputEventMap[key]];

    return events.concat(newEvents.map(({ selector, action }) => (
      makeEvent(action, [selector, entityId])
    )));
  }, []);

  return [componentState, inputEvents];
};
