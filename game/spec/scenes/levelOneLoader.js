import { meta, clearEventQueue, render, spriteLoader } from '../../engine/systems';
import { SCENES } from '../../engine/symbols';
import { makeId } from '../../engine/util';
import levelOne from './levelOne';
import { animationLoaderSpec } from '../player';

export const loader = spriteLoader([
  animationLoaderSpec,
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
