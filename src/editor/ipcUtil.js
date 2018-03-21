import { ipcRenderer } from 'electron';
import { EDITOR_TO_GAME } from 'Game/engine/symbols';

export const sendToGame = (eventType, payload) => {
  ipcRenderer.send(EDITOR_TO_GAME, [eventType, payload]);
};
