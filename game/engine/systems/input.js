// @flow
import { makeId } from '../util';
import { SYSTEMS } from '../symbols';
import { emitEvent } from '../events';

import type { System, GameState } from '../types';

export const KEYBOARD_INPUT = 'keyboardInput';

const KEY_DOWN = 'keydown';
const KEY_UP = 'keyup';

let inputsSet;

const inputs = new Set();

const keyDownHandler = (event) => {
  const keyCode = String.fromCharCode(event.keyCode);
  inputs.add(keyCode);
};

const keyUpHandler = (event) => {
  const keyCode = String.fromCharCode(event.keyCode);
  inputs.delete(keyCode);
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
    const currentInputs = { ...inputs };

    // add event of currently pressed keys to state.events.queue
    if (Object.keys(currentInputs).length > 0) {
      return emitEvent(state, currentInputs, [KEYBOARD_INPUT]);
    }
    return state;
  },
};

export default input;
