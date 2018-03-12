// @flow
import 'babel-polyfill';
import { pipe } from 'ramda';
import { app, ipcMain } from 'electron';

import {
  END, MAIN, CONFIG, BACKEND,
  READY, WILL_QUIT,
  CLOSE_CONFIG, INIT_START, INIT_MESSAGE, INIT_END,
  REQUEST_START,
  // OPEN_EDITOR,
} from 'App/actionTypes';

import { onRequest } from './dbAgent';
import {
  onConfigMessage,
  onConfigInitStart,
  onConfigInitEnd,
  onCloseConfig,
} from './observations/config';
import { onRunMain, onRequestCloseMain } from './observations/main';

import { getProcess, setEffect, getEffect, makeInitialState } from './utils/stateUtil';

const setObservation = observer => (process, emitter, eventType, onEvent) => (state) => {
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
    console.log(`event ${type} has no corresponding process ${name}! skipping...`);
    return state;
  }

  console.log('emitting event', type);
  return await onEvent(state, ...args);
};

class Observer {
  observers = [];

  subscribe = (fn) => {
    this.observers.push(fn);
  }

  unsubscribe = (fn) => {
    this.observers = this.observers.filter(subscriber => subscriber !== fn);
  }

  dispatch = async (data) => {
    for (const subscriber of this.observers) {
      await subscriber(data);
    }
  }
}

const observer = new Observer();
export const observe = setObservation(observer);

// set listeners on the initial state
const initialState = pipe(
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
)(makeInitialState(app, observer));

let state = initialState;
const runQueue = async (data) => {
  const next = await runJobQueue(state, data);
  state = next;
  if (!state) observer.unsubscribe(runQueue);
};

observer.subscribe(runQueue);
