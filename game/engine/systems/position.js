// @flow
// system for x, y, z stage placement
import { makeId } from '../util';
import { position as positionComponent } from '../components';
import { SYSTEMS } from '../symbols';

import type { System } from '../types';

const POSITION = 'position';

const position: System = {
  label: POSITION,
  id: makeId(SYSTEMS),
  component: positionComponent,
};

export default position;
