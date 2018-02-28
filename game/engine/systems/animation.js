// @flow
// system for animating frames of an entity
import { makeId } from '../util';
import { animateable } from '../components';
import { SYSTEMS } from '../symbols';

import type { System } from '../types';

const ANIMATION = 'animation';

const animation: System = {
  label: ANIMATION,
  id: makeId(SYSTEMS),
  component: animateable,
};

export default animation;
