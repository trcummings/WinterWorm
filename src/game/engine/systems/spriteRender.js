// @flow
// system for animating frames of an entity
import { makeId } from '../util';
import { renderable } from '../components';
import { SYSTEMS } from '../symbols';

import type { System } from '../types';

const SPRITE_RENDER = 'spriteRender';

const spriteRender: System = {
  label: SPRITE_RENDER,
  id: makeId(SYSTEMS),
  component: renderable,
};

export default spriteRender;
