// @flow

const START_LOOP = 'loop/START_LOOP';
const STOP_LOOP = 'loop/STOP_LOOP';
const UPDATE_TIME = 'loop/UPDATE_TIME';

export opaque type Dt = DOMHighResTimeStamp;

type LongInteger = number | null;

export opaque type LoopAction = {
  type: string,
  payload?: Dt
};

type MaybeAction = LoopAction | null;
type UpdateFunction = (LoopState, (MaybeAction) => mixed) => mixed;

export opaque type LoopState = {
  updateFn: UpdateFunction,
  isLooping: boolean,
  startTime: Dt | 0,
  currentTime: Dt | 0,
  dt: Dt,
};


export const makeInitialLoopState = (updateFn: UpdateFunction): LoopState => ({
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

export const stopLoopAction: LoopAction = {
  type: STOP_LOOP,
};

const startLoopAction: LoopAction = {
  type: START_LOOP,
  payload: performance.now(),
};

export const getDt = (loopState: LoopState): Dt => loopState.dt;

const update = (state: LoopState, action: LoopAction): LoopState => {
  switch (action.type) {
    case UPDATE_TIME: {
      const timestamp = action.payload;
      const currentTime = state.currentTime;
      return {
        ...state,
        currentTime: timestamp,
        dt: timestamp ? timestamp - currentTime : state.dt,
      };
    }

    case START_LOOP: {
      const timestamp = action.payload;
      return {
        ...state,
        isLooping: true,
        startTime: timestamp,
        currentTime: timestamp,
      };
    }

    case STOP_LOOP: {
      return {
        ...state,
        isLooping: false,
      };
    }

    default: return state;
  }
};

const view = (loopState: LoopState): LongInteger => (
  window.requestAnimationFrame((dt: Dt) => {
    if (!loopState.isLooping) return;

    const action = makeTimeUpdateAction(dt);
    const newState = update(loopState, action);

    loopState.updateFn(newState, (mAction: MaybeAction) => (
      mAction ?
        view(update(newState, (mAction: LoopAction))) :
        view(newState)
    ));
  }));

const loop = (loopState: LoopState): LongInteger => (
  view(update(loopState, startLoopAction))
);

export default loop;
