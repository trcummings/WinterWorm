import { view, lensPath, assocPath, lensProp, assoc } from 'ramda';

export const initialProcessState = {
  process: null,
  state: {},
};

export const makeInitialState = (app, observe) => ({
  observe,
  effects: {},
  main: Object.assign({}, initialProcessState, { process: app }),
  backend: initialProcessState,
  editor: initialProcessState,
  config: initialProcessState,
  game: initialProcessState,
});

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

export const closeProcess = (name, state, effect = () => {}) => {
  console.log(`attempting to close process ${name}...`);
  const prc = getProcess(name, state);

  if (prc) effect(prc);
  else console.log(`process ${name} already closed!`);

  return assoc(name, initialProcessState, state);
};

export const getObserve = state => view(lensProp('observe'), state);
