// @flow
import { getLoopState } from 'Game/engine/loop';

import type { GameState } from 'Types';

let timer = 0;
export const loggerMiddleware = (state: GameState): GameState => {
  const loopState = getLoopState(state);
  if (Number.isNaN(timer)) timer = 0;
  timer += loopState.frameTime;

  if (timer > 10000) {
    timer = 0;
    console.log('logging', state);
  }

  return state;
};
