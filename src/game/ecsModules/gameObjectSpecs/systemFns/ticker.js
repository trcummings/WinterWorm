// @flow
// system for dispatching time tick events each tick
import { TIME_TICK } from 'Engine/symbols';
import { emitBatchToQueue } from 'Engine/events';
import { getLoopState } from 'Engine/loop';

import type { GameState } from 'Types';

export default (state: GameState) => {
  const loopState = getLoopState(state);
  return emitBatchToQueue(state, TIME_TICK, loopState);
};
