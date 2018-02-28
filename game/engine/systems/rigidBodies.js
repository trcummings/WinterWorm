// @flow
import { makeId } from '../util';
import { rigidBody } from '../components';
import { SYSTEMS } from '../symbols';

import type { System } from '../types';

const RIGID_BODIES = 'rigidBodies';

const rigidBodies: System = {
  label: RIGID_BODIES,
  id: makeId(SYSTEMS),
  component: rigidBody,
};

export default rigidBodies;
