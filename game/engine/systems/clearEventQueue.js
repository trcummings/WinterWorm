// @flow
import { assocPath } from 'ramda';
import { makeId } from '../util';
import { queuePath } from '../events';
import { SYSTEMS } from '../symbols';

import type { GameState, System } from '../types';

const clearEventQueue: System = {
  id: makeId(SYSTEMS),
  fn: (state: GameState): GameState => assocPath(queuePath, {}, state),
};

export default clearEventQueue;
