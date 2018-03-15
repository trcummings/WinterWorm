// @flow
import { getLoopState } from 'Engine/loop';

import type { GameState } from 'Types';

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
