import { meta, clearEventQueue, render } from '../../engine/systems';
import { SCENES } from '../../engine/symbols';
import { makeId } from '../../engine/util';

const levelOne = {
  id: makeId(SCENES),
  systems: [
    meta.id,
    render.id,
    clearEventQueue.id,
  ],
};

export default levelOne;
