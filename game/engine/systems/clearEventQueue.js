// @flow
import { assocPath } from 'ramda';
import { makeId } from '../util';
import { queuePath } from '../events';

import type { GameState, System } from '../types';

const clearEventQueue: System = {
  id: makeId(),
  fn: (state: GameState): GameState => assocPath(queuePath, {}, state),
};

export default clearEventQueue;
