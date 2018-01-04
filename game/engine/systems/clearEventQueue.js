// @flow
import { makeId } from '../util';
import { clearEventsQueue } from '../events';

import type { GameState, System } from '../types';

const clearEventQueue: System = {
  id: makeId(),
  fn: (state: GameState): GameState => clearEventsQueue(state),
};

export default clearEventQueue;
