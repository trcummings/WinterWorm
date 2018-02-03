// @flow
import { ipcRenderer } from 'electron';
import {
  PLAY,
  PAUSE,
  REFRESH,
  LOAD_SPEC,
} from '../../app/actionTypes';

import { getLoopState, setLoopState } from './loop';

import type { GameState } from './types';

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
        const loopState = getLoopState();
        nextState = makeGameState();
        nextState = setLoopState(nextState, loopState);
        break;
      }
      case LOAD_SPEC: break;
      default: break;
    }
  }

  return nextState;
};
