// @flow
import { view, lensPath, assocPath, assoc } from 'ramda';
import {
  PROCESS,
  STATE,
  EFFECTS,
  processes,
} from 'App/actionTypes';

export const initialProcessState = {
  [PROCESS]: null,
  [STATE]: {},
};

export const makeInitialState = app => ({
  [EFFECTS]: {},
  [processes.MAIN]: Object.assign({}, initialProcessState, { [PROCESS]: app }),
  [processes.BACKEND]: initialProcessState,
  [processes.EDITOR]: initialProcessState,
  [processes.CONFIG]: initialProcessState,
  [processes.GAME]: initialProcessState,
});

const getProp = prop => (name, state) => (
  view(lensPath([name, prop]), state)
);

const setProp = prop => (name, value, state) => (
  assocPath([name, prop], value, state)
);

export const getProcess = getProp(PROCESS);
export const setProcess = setProp(PROCESS);
export const getState = getProp(STATE);
export const setState = setProp(STATE);

export const setEffect = (eventType, fn, state) => (
  assocPath([EFFECTS, eventType], fn, state)
);

export const getEffect = (eventType, state) => (
  view(lensPath([EFFECTS, eventType]), state)
);

export const closeProcess = (name, state, effect = () => {}) => {
  console.log(`attempting to close process ${name}...`);
  const prc = getProcess(name, state);

  if (prc) effect(prc);
  else console.log(`process ${name} already closed!`);

  return assoc(name, initialProcessState, state);
};
