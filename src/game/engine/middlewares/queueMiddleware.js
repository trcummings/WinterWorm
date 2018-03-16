// @flow
import { ipcRenderer } from 'electron';
import {
  PLAY,
  PAUSE,
  REFRESH,
  LOAD_SPEC,
} from 'App/actionTypes';
import { getLoopState, setLoopState } from 'Engine/loop';

import type { GameState } from 'Types';

type QueueEvent =
  | PLAY
  | PAUSE
  | REFRESH
  | LOAD_SPEC

type Queue = Array<QueueEvent>

const addToQueue = (queue: Queue) => (_, event: QueueEvent): Queue => {
  queue.push(event);
  return queue;
};

const shiftQueueEvent = (queue: Queue): QueueEvent => queue.shift();

const setQueueEvent = (queue: Queue, type: QueueEvent): Queue => {
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
  makeGameState: () => GameState,
  queue: Queue
) => (state: GameState): GameState => {
  let nextState = state;

  while (queue.length > 0) {
    const event = shiftQueueEvent(queue);

    switch (event) {
      case PLAY: break;
      case PAUSE: break;
      case REFRESH: {
        nextState = setLoopState(makeGameState(), getLoopState());
        break;
      }
      case LOAD_SPEC: break;
      default: break;
    }
  }

  return nextState;
};
