// @flow
import { ipcRenderer } from 'electron';
import {
  PLAY,
  PAUSE,
  REFRESH,
  LOAD_SPEC,
  UPDATE_COMPONENT_STATE,
} from 'App/actionTypes';
import { setComponentState } from 'Game/engine/ecs';
import { getLoopState, setLoopState } from 'Game/engine/loop';
import { EDITOR_TO_GAME } from 'Game/engine/symbols';

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
  ipcRenderer.on(EDITOR_TO_GAME, addToQueue(queue));
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

    switch (eventType) {
      case REFRESH: {
        nextState = setLoopState(makeGameState(initialEntitySpecs), getLoopState());
        break;
      }

      case UPDATE_COMPONENT_STATE: {
        const { state: componentState, componentId, entityId } = payload;
        nextState = setComponentState(state, componentId, entityId, componentState);
        break;
      }

      default: break;
    }
  }

  return nextState;
};
