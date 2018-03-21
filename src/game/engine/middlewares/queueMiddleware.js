// @flow
import { ipcRenderer } from 'electron';
import {
  PLAY,
  PAUSE,
  REFRESH,
  LOAD_SPEC,
  GAME_EVENT,
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

export const setUpQueue = (queue: Queue = []): Queue => {
  ipcRenderer.on(GAME_EVENT, addToQueue(queue));
  return queue;
};

export const queueMiddleware = (
  initialEntitySpecs,
  makeGameState: () => GameState,
  queue: Queue
) => (state: GameState): GameState => {
  let nextState = state;

  while (queue.length > 0) {
    const [eventType, payload] = shiftQueueEvent(queue);
    console.log(eventType, payload);

    switch (eventType) {
      case REFRESH: {
        nextState = setLoopState(makeGameState(initialEntitySpecs), getLoopState());
        break;
      }

      default: break;
    }
  }

  return nextState;
};
