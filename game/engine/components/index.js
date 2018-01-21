import { renderable } from './renderable';
import { positionable, makePositionState } from './positionable';
import { animateable } from './animateable';
import { inputControllable } from './inputControllable';
import { accelerable, makeAccelState } from './accelerable';
import { moveable, makeVelocityState } from './moveable';
import { fixture } from './fixture';
import { rigidBody } from './rigidBody';

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
  fixture,
  rigidBody,
  utils,
};
