// @flow
import {
  CONFIG, EDITOR, BACKEND,
  INIT_MESSAGE, INIT_ERROR, INIT_END,
} from 'App/actionTypes';
import {
  // signalEnd,
  // initialProcessState,
  setProcess,
  // getProcess,
  getState,
  setState,
  closeProcess,
} from 'App/utils/stateUtil';
import { mkdir } from 'App/utils/backendUtil';
import { makeLoaderPhrases } from 'App/utils/loaderUtil';

import { initBackend, initDb } from './backend';
import { onOpenEditor } from './editor';

export const onCloseConfig = state => closeProcess(CONFIG, state, config => config.close());

// 3 init functions
const makeFile = async (state, { isNew, filename }) => {
  // if new, we want to create the folder for all this to live in
  if (isNew) await mkdir(filename);
  return [null, state];
};

const makeBackend = async (state, { isNew, filename }) => {
  const [err, backend] = await initBackend(state, { isNew, filename });
  if (err) return [err, state];

  return [null, setProcess(BACKEND, backend, state)];
};

const makeDb = async (state, { isNew }) => {
  if (isNew) {
    const resp = await initDb();
    if (resp.error) return [resp.error, state];
  }
  return [null, state];
};

const asyncTimeout = time => new Promise(resolve => setTimeout(resolve, time));

export const onConfigMessage = async (state, event) => {
  const { tasks, ...rest } = getState(CONFIG, state);

  if (tasks.length === 0) {
    event.sender.send(INIT_END);
    return state;
  }

  const fn = tasks.shift();
  const [err, next] = await fn(state, { ...rest });

  if (err) event.sender.send(INIT_ERROR, err);
  else {
    await asyncTimeout(500);
    event.sender.send(INIT_MESSAGE, makeLoaderPhrases());
  }

  return next;
};

// set up our list of tasks in the state
export const onConfigInitStart = (state, event, { filename, isNew }) => {
  const tasks = [makeFile, makeBackend, makeDb];
  const next = setState(CONFIG, { filename, isNew, tasks }, state);

  event.sender.send(INIT_MESSAGE, makeLoaderPhrases());

  return next;
};

// clean up the extra event listeners?
export const onConfigInitEnd = async (state) => {
  const { filename, isNew } = getState(CONFIG, state);

  // give the 'editor' module the filename so it can load properly
  const next = setState(EDITOR, { filename, isNew }, state);

  // clear out the config window's state
  return onCloseConfig(onOpenEditor(next));
};
