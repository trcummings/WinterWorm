import path from 'path';

import { meta, clearEventQueue, render, spriteLoader } from '../../engine/systems';
import { SCENES } from '../../engine/symbols';
import { makeId } from '../../engine/util';
import levelOne from './levelOne';

export const loader = spriteLoader([
  { name: 'player', path: path.resolve(process.env.ASSET_PATH, './player/player.json') },
], levelOne.id);

const levelOneLoader = {
  id: makeId(SCENES),
  systems: [
    meta.id,
    loader.id,
    render.id,
    clearEventQueue.id,
  ],
};

export default levelOneLoader;
