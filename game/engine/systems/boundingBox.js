// @flow
// system for height and width of an entity
import { makeId } from '../util';
import { boundingRect } from '../components';
import { SYSTEMS } from '../symbols';

import type { System } from '../types';

const BOUNDING_BOX = 'boundingBox';

const boundingBox: System = {
  label: BOUNDING_BOX,
  id: makeId(SYSTEMS),
  component: boundingRect,
};

export default boundingBox;
