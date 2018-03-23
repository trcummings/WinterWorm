// @flow
import { ipcRenderer } from 'electron';
import {
  PLAY,
  PAUSE,
  REFRESH,
  LOAD_SPEC,
  UPDATE_COMPONENT_STATE,
  SELECT_INSPECTOR_ENTITY,
  EMIT_QUEUE_EVENT,
} from 'App/actionTypes';
import { setComponentState, getComponentState } from 'Game/engine/ecs';
import { EDITOR_TO_GAME, PIXI_INTERACTION } from 'Game/engine/symbols';
import { getLoopState, setLoopState } from 'Game/engine/loop';
import { emitEvent, emitSingleEvent } from 'Game/engine/events';

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

      case EMIT_QUEUE_EVENT: {
        nextState = emitSingleEvent(state, payload);
        break;
      }

      case UPDATE_COMPONENT_STATE: {
        const { state: componentState, componentId, entityId } = payload;
        const initialComponentState = getComponentState(state, componentId, entityId);
        const newComponentState = { ...initialComponentState, ...componentState };

        nextState = setComponentState(state, componentId, entityId, newComponentState);
        break;
      }

      case SELECT_INSPECTOR_ENTITY: {
        nextState = emitEvent(state, payload, [PIXI_INTERACTION]);
        break;
      }

      default: break;
    }
  }

  return nextState;
};
