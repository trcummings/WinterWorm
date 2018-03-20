// @flow
import { ipcRenderer } from 'electron';
import {
  PLAY,
  PAUSE,
  REFRESH,
  LOAD_SPEC,
} from 'App/actionTypes';
import { getLoopState, setLoopState } from 'Game/engine/loop';

import type { GameState } from 'Types';

type QueueEventType =
  | typeof PLAY
  | typeof PAUSE
  | typeof REFRESH
  | typeof LOAD_SPEC;

type QueueEvent = [QueueEventType, *];

type Queue = Array<QueueEvent>;

const addToQueue = (queue: Queue) => (_, event: QueueEvent): Queue => {
  queue.push(event);
  return queue;
};

const shiftQueueEvent = (queue: Queue): QueueEvent => queue.shift();

const setQueueEvent = (queue: Queue, type: QueueEventType): Queue => {
  ipcRenderer.on(type, addToQueue(queue));
  return queue;
};

export const setUpQueue = (queue: Queue = []): Queue => ([
  PLAY,
  PAUSE,
  REFRESH,
  LOAD_SPEC,
].reduce(setQueueEvent, queue));

export const queueMiddleware = (
  initialEntitySpecs,
  makeGameState: () => GameState,
  queue: Queue
) => (state: GameState): GameState => {
  let nextState = state;

  while (queue.length > 0) {
    const [eventType] = shiftQueueEvent(queue);

    switch (eventType) {
      case PLAY: break;
      case PAUSE: break;
      case REFRESH: {
        nextState = setLoopState(makeGameState(initialEntitySpecs), getLoopState());
        break;
      }
      case LOAD_SPEC: break;
      default: break;
    }
  }

  return nextState;
};
