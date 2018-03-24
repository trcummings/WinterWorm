// @flow
import { view, lensPath, over, compose } from 'ramda';

import { GAME_LOOP, STATE } from './symbols';
import { conjoin } from './util';

import { type GameState } from './types';

export type Timestamp = DOMHighResTimeStamp | number;

export type LoopState = {
  startTime: Timestamp,
  currentTime?: Timestamp,
  frameTime?: Timestamp,
};

const loopStateLens = lensPath([STATE, GAME_LOOP]);
export const getLoopState = (state: GameState) => view(loopStateLens, state);
export const setLoopState = (state: GameState, loopState: LoopState) => (
  over(loopStateLens, conjoin(loopState), state)
);

const makeLoopState = (timestamp: Timestamp): LoopState => ({
  startTime: timestamp,
  currentTime: timestamp,
  frameTime: 0.01,
});

const updateLoopState = (timestamp: Timestamp) => (state: GameState): GameState => {
  const loopState: LoopState = getLoopState(state);
  const newLoopState = !loopState
    ? makeLoopState(timestamp)
    : ({
      ...loopState,
      currentTime: timestamp,
      frameTime: timestamp - loopState.currentTime,
    });

  return setLoopState(state, newLoopState);
};

export const gameLoop = (
  loopFn: () => number,
  state: GameState,
  update: GameState => GameState,
) => (timestamp?: Timestamp): number => {
  const updateFn = compose(update, updateLoopState(timestamp));
  return loopFn(gameLoop(loopFn, updateFn(state), update));
};
