// @flow
import { makeId } from '../util';
import { SYSTEMS, KEYBOARD_INPUT } from '../symbols';
import { getSubscribedEntityIds } from '../ecs';
import { emitEvents, makeEvent } from '../events';

import type { System, GameState } from '../types';

const KEY_DOWN = 'keydown';
const KEY_UP = 'keyup';

let inputsSet;

const inputs = {};

const keyDownHandler = (event) => {
  const keyCode = String.fromCharCode(event.keyCode);
  inputs[keyCode] = true;
};

const keyUpHandler = (event) => {
  const keyCode = String.fromCharCode(event.keyCode);
  delete inputs[keyCode];
};

export const clearHandlers = () => {
  document.removeEventListener(KEY_UP, keyUpHandler);
  document.removeEventListener(KEY_DOWN, keyDownHandler);
  inputsSet = undefined;
};

const setHandlers = () => {
  document.addEventListener(KEY_UP, keyUpHandler);
  document.addEventListener(KEY_DOWN, keyDownHandler);
  inputsSet = true;
};

const inputId = makeId(SYSTEMS);
const input: System = {
  id: inputId,
  fn: (state: GameState): GameState => {
    // if we haven't set them up yet, initialize the key event handlers
    if (!inputsSet) setHandlers();

    // capture mutable input object right NOW by making a shallow copy
    // god this feels so unsafe
    const keyboardInput = Object.assign({}, inputs);
    const hasInput = Object.keys(keyboardInput).length > 0;

    // add event of currently pressed keys to state.events.queue
    if (hasInput) {
      const entityIds = getSubscribedEntityIds(state, KEYBOARD_INPUT);
      const events = entityIds.map(id => makeEvent(keyboardInput, [KEYBOARD_INPUT, id]));
      return emitEvents(state, events);
    }
    return state;
  },
};

export default input;
