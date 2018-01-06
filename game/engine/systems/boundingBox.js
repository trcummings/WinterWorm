// @flow
import { makeId } from '../util';
import { boundingRect } from '../components';
import { SYSTEMS } from '../symbols';

import type { System } from '../types';

const boundingBox: System = {
  id: makeId(SYSTEMS),
  component: boundingRect,
};

export default boundingBox;
