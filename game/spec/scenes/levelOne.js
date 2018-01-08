import { meta, clearEventQueue, render, graphicsRect, position, boundingBox, input, inputDebug } from '../../engine/systems';
import { SCENES } from '../../engine/symbols';
import { makeId } from '../../engine/util';

const levelOne = {
  id: makeId(SCENES),
  systems: [
    input.id,
    inputDebug.id,
    meta.id,
    position.id,
    boundingBox.id,
    graphicsRect.id,
    render.id,
    clearEventQueue.id,
  ],
};

export default levelOne;
