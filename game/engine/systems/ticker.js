// @flow
// system for dispatching time tick events each tick
import { makeId } from '../util';
import { SYSTEMS, TIME_TICK } from '../symbols';
import { emitBatchToQueue } from '../events';
import { getLoopState } from '../loop';

import type { System, GameState } from '../types';

const TICKER = 'ticker';

const ticker: System = {
  label: TICKER,
  id: makeId(SYSTEMS),
  fn: (state: GameState) => {
    const loopState = getLoopState(state);
    return emitBatchToQueue(state, TIME_TICK, loopState);
  },
};

export default ticker;
