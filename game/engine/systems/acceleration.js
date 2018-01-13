// @flow
// system for acceleration
import { makeId } from '../util';
import { accelerable } from '../components';
import { SYSTEMS } from '../symbols';

import type { System } from '../types';

const ACCELERATION = 'acceleration';

const acceleration: System = {
  label: ACCELERATION,
  id: makeId(SYSTEMS),
  component: accelerable,
};

export default acceleration;
