import { view, lensPath, assocPath } from 'ramda';

export const initialProcessState = {
  process: null,
  state: {},
};

export const initialAppState = {
  effects: {},
  main: initialProcessState,
  backend: initialProcessState,
  editor: initialProcessState,
  config: initialProcessState,
  game: initialProcessState,
};

const getProp = prop => (name, state) => (
  view(lensPath([name, prop]), state)
);

const setProp = prop => (name, value, state) => (
  assocPath([name, prop], value, state)
);

export const getProcess = getProp('process');
export const setProcess = setProp('process');
export const getState = getProp('state');
export const setState = setProp('state');

export const setEffect = (eventType, fn, state) => (
  assocPath(['effects', eventType], fn, state)
);

export const getEffect = (eventType, state) => (
  view(lensPath(['effects', eventType]), state)
);

export const signalEnd = () => null;
