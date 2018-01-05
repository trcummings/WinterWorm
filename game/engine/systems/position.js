// @flow
import { makeId } from '../util';
import { position as positionComponent } from '../components';
import { SYSTEMS } from '../symbols';

import type { System } from '../types';

const position: System = {
  id: makeId(SYSTEMS),
  component: positionComponent,
};

export default position;
