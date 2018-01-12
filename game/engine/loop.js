// @flow
import { view, lensPath, over } from 'ramda';

import { GAME_LOOP, STATE } from './symbols';

import { getUpdateFn } from './ecs';
import { conjoin } from './util';

import type { Timestamp, LoopState } from './types';

const loopStateLens = lensPath([STATE, GAME_LOOP]);
export const getLoopState = (state: GameState) => view(loopStateLens, state);
export const setLoopState = (state: GameState, loopState: LoopState) => (
  over(loopStateLens, conjoin(loopState), state)
);
const updateLoopState = (state: GameState, timestamp: Timestamp): GameState => {
  const loopState: LoopState = getLoopState(state);
  let newLoopState;
  if (!loopState) {
    newLoopState = {
      startTime: timestamp,
      currentTime: timestamp,
      frameTime: 0.01,
    };
  } else {
    newLoopState = {
      ...loopState,
      currentTime: timestamp,
      frameTime: timestamp - loopState.currentTime,
    };
  }

  return setLoopState(state, newLoopState);
};

export const nextStateAfterLoop = (
  state: GameState,
  timestamp: Timestamp
): GameState => {
  const next = updateLoopState(state, timestamp);
  const updateFn = getUpdateFn(next);
  return updateFn(next);
};
