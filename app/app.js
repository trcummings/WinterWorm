// @flow
import { pipe } from 'ramda';
import { app, ipcMain } from 'electron';
import 'babel-polyfill';

import {
  READY, WILL_QUIT,
  CLOSE_CONFIG, INIT_START, INIT_MESSAGE, INIT_END,
  REQUEST_START,
  OPEN_EDITOR,
} from 'App/actionTypes';

import { onRequest } from './dbAgent';
import {
  onConfigMessage,
  onConfigInitStart,
  onConfigInitEnd,
  onCloseConfig,
} from './observations/config';
import { onRunMain, onRequestCloseMain } from './observations/main';
import { onOpenEditor } from './observations/editor';

import { setEffect, getEffect, initialAppState } from './utils/stateUtil';

const setObservation = observer => (emitter, eventType, onEvent) => (state) => {
  emitter.on(eventType, (...args) => observer.dispatch({
    type: eventType,
    args: [...args],
  }));

  return setEffect(eventType, ({ onEvent }), state);
};

const runJobQueue = async (state, { type, args }) => {
  const { onEvent } = getEffect(type, state);
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
const observe = setObservation(observer);

// set listeners on the initial state
const initialState = pipe(
  // for the main process
  observe(app, READY, onRunMain),
  observe(app, WILL_QUIT, onRequestCloseMain),

  // for the database/REST API
  observe(ipcMain, REQUEST_START, onRequest),

  // for the config app
  observe(ipcMain, CLOSE_CONFIG, onCloseConfig),
  observe(ipcMain, INIT_START, onConfigInitStart),
  observe(ipcMain, INIT_MESSAGE, onConfigMessage),
  observe(ipcMain, INIT_END, onConfigInitEnd),

  // for the editor
  observe(ipcMain, OPEN_EDITOR, onOpenEditor),
)(initialAppState);

let state = initialState;
const runQueue = async (data) => {
  const next = await runJobQueue(state, data);
  state = next;
  if (!state) observer.unsubscribe(runQueue);
};

observer.subscribe(runQueue);
