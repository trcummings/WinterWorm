// @flow
// system for x, y, z stage placement
import { makeId } from '../util';
import { positionable } from '../components';
import { SYSTEMS } from '../symbols';

import type { System } from '../types';

const POSITION = 'position';

const position: System = {
  label: POSITION,
  id: makeId(SYSTEMS),
  component: positionable,
};

export default position;
