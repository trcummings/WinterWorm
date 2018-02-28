// @flow
// input.js: system for listening to keyboard input events
import { makeId } from '../util';
import { SYSTEMS, KEYBOARD_INPUT } from '../symbols';
import { emitBatchToQueue } from '../events';

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

const INPUT = 'input';

// const hold = a => () => a;

const input: System = {
  label: INPUT,
  id: makeId(SYSTEMS),
  fn: (state: GameState): GameState => {
    // if we haven't set them up yet, initialize the key event handlers
    if (!inputsSet) setHandlers();

    // capture mutable input object right NOW by making a shallow copy
    const keyboardInput = Object.assign({}, inputs);
    const hasInput = Object.keys(keyboardInput).length > 0;

    // add event of currently pressed keys to state.events.queue
    if (hasInput) return emitBatchToQueue(state, KEYBOARD_INPUT, keyboardInput);
    return state;
  },
};

export default input;
