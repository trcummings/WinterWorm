// @flow
import { getLoopState } from './loop';

import type { GameState } from './types';

let timer = 0;
export const loggerMiddleware = (state: GameState): GameState => {
  const loopState = getLoopState(state);
  timer += loopState.frameTime;
  if (timer > 10000) {
    timer = 0;
    console.log('logging', state);
  }

  return state;
};
