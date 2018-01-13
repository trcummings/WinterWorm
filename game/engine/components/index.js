import { renderable } from './renderable';
import { positionable, makePositionState } from './positionable';
import { animateable } from './animateable';
import { inputControllable } from './inputControllable';
import { accelerable, makeAccelState } from './accelerable';
import { moveable, makeVelocityState } from './moveable';

const utils = {
  makePositionState,
  makeAccelState,
  makeVelocityState,
};

export {
  renderable,
  positionable,
  animateable,
  inputControllable,
  accelerable,
  moveable,
  utils,
};
