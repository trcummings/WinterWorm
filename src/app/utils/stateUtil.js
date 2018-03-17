// @flow
import type { app as App } from 'electron';
import { view, lensPath, assocPath, assoc } from 'ramda';
import {
  PROCESS,
  STATE,
  EFFECTS,
  processes,
  type ProcessType,
  type EventTypes,
} from 'App/actionTypes';

import type { Process } from 'App/types';
import type { EditorState } from 'App/observations/editor';

export const initialProcessState = {
  [PROCESS]: null,
  [STATE]: {},
};

type ProcessState =
  | EditorState
  | {};

export type InitialProcessState = {
  process: Process,
  state: ProcessState
};

export type State = {
  effects: {
    [EventTypes]: {}
  },
  [ProcessType]: InitialProcessState,
};

export const makeInitialState = (app: App): State => ({
  [EFFECTS]: {},
  [processes.MAIN]: Object.assign({}, initialProcessState, { [PROCESS]: app }),
  [processes.BACKEND]: initialProcessState,
  [processes.EDITOR]: initialProcessState,
  [processes.CONFIG]: initialProcessState,
  [processes.GAME]: initialProcessState,
});

type Prop = typeof PROCESS | typeof STATE;
const getProp = prop => (name: Prop, state: State) => (
  view(lensPath([name, prop]), state)
);

const setProp = prop => (name: Prop, value: *, state: State) => (
  assocPath([name, prop], value, state)
);

export const getProcess = getProp(PROCESS);
export const setProcess = setProp(PROCESS);
export const getState = getProp(STATE);
export const setState = setProp(STATE);

export const setEffect = (
  eventType: EventTypes,
  fn,
  state: State
) => assocPath([EFFECTS, eventType], fn, state);

export const getEffect = (
  eventType: EventTypes,
  state: State
) => view(lensPath([EFFECTS, eventType]), state);

const noOp = () => {};
export const closeProcess = (
  name: ProcessType,
  state: State,
  effect: (prc?: Process) => mixed = noOp
) => {
  console.log(`attempting to close process ${name}...`);
  const prc = getProcess(name, state);

  if (prc) effect(prc);
  else console.log(`process ${name} already closed!`);

  return assoc(name, initialProcessState, state);
};
