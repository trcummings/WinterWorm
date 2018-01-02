// @flow
//
import { compose } from 'ramda';

const START_LOOP = 'loop/START_LOOP';
const STOP_LOOP = 'loop/STOP_LOOP';
const UPDATE_TIME = 'loop/UPDATE_TIME';

export opaque type Dt = DOMHighResTimeStamp;

type LongInteger = number | null;

type LoopAction = {
  type: string,
  payload?: Dt
};

export opaque type LoopState = {
  updateFn: (LoopState) => mixed,
  isLooping: boolean,
  startTime: Dt | 0,
  currentTime: Dt | 0,
  dt: Dt,
};

export const makeInitialLoopState = (updateFn: (LoopState) => mixed): LoopState => ({
  updateFn,
  isLooping: false,
  startTime: 0,
  currentTime: 0,
  dt: 0.01,
});

export const makeTimeUpdateAction = (timestamp: Dt): LoopAction => ({
  type: UPDATE_TIME,
  payload: timestamp,
});

export const makeStopLoopAction = (): LoopAction => ({
  type: STOP_LOOP,
});

const startLoopAction: LoopAction = {
  type: START_LOOP,
  payload: performance.now(),
};

export const getDt = (loopState: LoopState): Dt => loopState.dt;

const update = (loopState: LoopState) => (action: LoopAction): LoopState => {
  switch (action.type) {
    case UPDATE_TIME: {
      const timestamp = action.payload;
      const currentTime = loopState.currentTime;
      return {
        ...loopState,
        currentTime: timestamp,
        dt: timestamp ? timestamp - currentTime : loopState.dt,
      };
    }

    case START_LOOP: {
      const timestamp = action.payload;
      return {
        ...loopState,
        isLooping: true,
        startTime: timestamp,
        currentTime: timestamp,
      };
    }

    case STOP_LOOP: {
      return {
        ...loopState,
        isLooping: false,
      };
    }

    default: return loopState;
  }
};

const view = (loopState: LoopState): LongInteger => {
  if (!loopState.isLooping) return null;
  loopState.updateFn(loopState);
  const next = compose(view, update(loopState), makeTimeUpdateAction);
  return window.requestAnimationFrame(next);
};

const loop = (loopState: LoopState): LongInteger => {
  const next = update(loopState);
  return view(next(startLoopAction));
};

export default loop;
