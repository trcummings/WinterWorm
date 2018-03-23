import { ipcRenderer } from 'electron';
import { EMIT_QUEUE_EVENT } from 'App/actionTypes';
import { EDITOR_TO_GAME } from 'Game/engine/symbols';
import { makeEvent } from 'Game/engine/events';

export const sendToGame = (eventType, payload) => {
  ipcRenderer.send(EDITOR_TO_GAME, [eventType, payload]);
};

export const emitQueueEvent = (action, selectors) => {
  sendToGame(EMIT_QUEUE_EVENT, makeEvent(action, selectors));
};
