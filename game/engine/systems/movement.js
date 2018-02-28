// @flow
// system for using acceleration and time to calculate velocity
import { makeId } from '../util';
import { moveable } from '../components';
import { SYSTEMS } from '../symbols';

import type { System } from '../types';

const MOVEMENT = 'movement';

const movement: System = {
  label: MOVEMENT,
  id: makeId(SYSTEMS),
  component: moveable,
};

export default movement;
