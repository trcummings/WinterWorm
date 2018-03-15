// @flow
import 'babel-polyfill';
import { compose } from 'ramda';
import { app, ipcMain } from 'electron';

import {
  END, MAIN, CONFIG, BACKEND, EDITOR, GAME,
  READY, WILL_QUIT,
  CLOSE_CONFIG, INIT_START, INIT_MESSAGE, INIT_END,
  REQUEST_START,
  GET_EDITOR_CONFIG,
  OPEN_GAME_START,
  SYNC,
} from 'App/actionTypes';

import './installDevTools';

import {
  onConfigMessage,
  onConfigInitStart,
  onConfigInitEnd,
  onCloseConfig,
} from './observations/config';
import { onRunMain, onRequestCloseMain } from './observations/main';
import { onGetEditorConfig } from './observations/editor';
import { onRequest } from './observations/backend';
import { onOpenGame, onGameSync } from './observations/game';

import { getProcess, setEffect, getEffect, makeInitialState } from './utils/stateUtil';

const setObservation = observer => (process, emitter, eventType, onEvent) => (state) => {
  console.log(`Setting effect "${eventType}"...`);
  emitter.on(eventType, (...args) => observer.dispatch({
    type: eventType,
    args: [...args],
  }));

  return setEffect(eventType, { process, onEvent }, state);
};

const runJobQueue = async (state, { type, args }) => {
  if (type === END) return null;

  const { onEvent, process: name } = getEffect(type, state);
  const process = getProcess(name, state);

  if (!process) {
    console.log(`Event "${type}" has no corresponding process "${name}"! skipping...`);
    return state;
  }

  console.log('Emitting event', type);
  return await onEvent(state, ...args);
};

class Observer {
  subscriber = () => {}

  subscribe = (fn) => {
    this.subscriber = fn;
  }

  unsubscribe = () => {
    this.subscriber = () => {};
  }

  dispatch = async data => await this.subscriber(data)
}

const observer = new Observer();
export const observe = setObservation(observer);

// set listeners on the initial state
const initialState = compose(
  // for the main process
  observe(MAIN, app, READY, onRunMain),
  observe(MAIN, app, WILL_QUIT, onRequestCloseMain),

  // for the database/REST API
  observe(BACKEND, ipcMain, REQUEST_START, onRequest),

  // for the config app
  observe(CONFIG, ipcMain, CLOSE_CONFIG, onCloseConfig),
  observe(CONFIG, ipcMain, INIT_START, onConfigInitStart),
  observe(CONFIG, ipcMain, INIT_MESSAGE, onConfigMessage),
  observe(CONFIG, ipcMain, INIT_END, onConfigInitEnd),

  // for the editor
  observe(EDITOR, ipcMain, GET_EDITOR_CONFIG, onGetEditorConfig),
  observe(EDITOR, ipcMain, OPEN_GAME_START, onOpenGame),

  // for the game
  observe(GAME, ipcMain, SYNC, onGameSync)
)(makeInitialState(app));

let state = initialState;
const runQueue = async (data) => {
  const next = await runJobQueue(state, data);
  state = next;
  if (!state) observer.unsubscribe(runQueue);
};

observer.subscribe(runQueue);
