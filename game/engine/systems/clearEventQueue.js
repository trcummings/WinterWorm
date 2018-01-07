// @flow
import { makeId } from '../util';
import { clearEventQueue as clearEvents } from '../events';
import { SYSTEMS } from '../symbols';

import type { System } from '../types';

const clearEventQueue: System = {
  id: makeId(SYSTEMS),
  fn: clearEvents,
};

export default clearEventQueue;
