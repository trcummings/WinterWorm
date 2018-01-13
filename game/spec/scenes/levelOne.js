import {
  meta,
  clearEventQueue,
  render,
  position,
  boundingBox,
  input,
  inputDebug,
  animation,
  spriteRender,
  ticker,
  inputControl,
} from '../../engine/systems';
import { SCENES } from '../../engine/symbols';
import { makeId } from '../../engine/util';

const levelOne = {
  id: makeId(SCENES),
  systems: [
    input.id,
    ticker.id,
    inputControl.id,
    inputDebug.id,
    meta.id,
    position.id,
    animation.id,
    boundingBox.id,
    spriteRender.id,
    render.id,
    clearEventQueue.id,
  ],
};

export default levelOne;
