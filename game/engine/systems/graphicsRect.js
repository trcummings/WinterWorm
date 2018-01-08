// @flow
// system for rendering graphical rectangles
import { makeId } from '../util';
import { renderableRect } from '../components';
import { SYSTEMS } from '../symbols';

import type { System } from '../types';

const graphicsRect: System = {
  id: makeId(SYSTEMS),
  component: renderableRect,
};

export default graphicsRect;
