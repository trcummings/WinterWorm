import {
  meta,
  clearEventQueue,
  render,
  position,
  acceleration,
  movement,
  input,
  animation,
  spriteRender,
  ticker,
  inputControl,
  physics,
  rigidBodies,
  fixtures,
} from '../../engine/systems';
import { SCENES } from '../../engine/symbols';
import { makeId } from '../../engine/util';

const levelOne = {
  id: makeId(SCENES),
  systems: [
    input.id,
    ticker.id,
    inputControl.id,
    meta.id,
    physics.id,
    rigidBodies.id,
    fixtures.id,
    acceleration.id,
    movement.id,
    position.id,
    animation.id,
    spriteRender.id,
    render.id,
    clearEventQueue.id,
  ],
};

export default levelOne;
