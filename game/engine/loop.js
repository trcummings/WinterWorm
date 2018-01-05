// @flow
import { view, lensPath, over } from 'ramda';

import { GAME_LOOP, STATE } from './symbols';

import { getUpdateFn } from './ecs';
import { conjoin } from './util';

type Timestamp = DOMHighResTimeStamp | number;
type LoopState = {
  startTime: Timestamp,
  currentTime?: Timestamp,
  dt?: Timestamp,
};

const loopStateLens = lensPath([STATE, GAME_LOOP]);
const updateLoopState = (state: GameState, timestamp: Timestamp): GameState => {
  const loopState: LoopState = view(loopStateLens, state);
  let newLoopState;
  if (!loopState) {
    newLoopState = {
      startTime: timestamp,
      currentTime: timestamp,
      dt: 0.01,
    };
  } else {
    const { currentTime, startTime } = loopState;
    newLoopState = {
      startTime,
      currentTime: timestamp,
      dt: timestamp - currentTime,
    };
  }

  return over(loopStateLens, conjoin(newLoopState), state);
};

export const nextStateAfterLoop = (
  state: GameState,
  timestamp: Timestamp
): GameState => {
  const next = updateLoopState(state, timestamp);
  const updateFn = getUpdateFn(next);
  return updateFn(next);
};
