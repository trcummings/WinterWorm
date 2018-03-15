// @flow
import { assocPath, view, lensPath, curry } from 'ramda';

import {
  ASSET_LOADERS,
  SPRITE_LOADER,
  STATE,
  FN,
} from '../symbols';

import type { GameState } from '../types';

export type LoaderState = {
  started: boolean,
  loading: boolean,
  completed: boolean,
  meta: mixed,
};

export type LoaderFn = GameState => GameState;

type LoaderType = typeof SPRITE_LOADER;

export const getLoaderTypes = (state: GameState) => (
  Object.keys(view(lensPath([STATE, ASSET_LOADERS]), state))
);

export const makeLoaderState = (meta: mixed): LoaderState => ({
  started: false,
  loading: false,
  completed: false,
  meta,
});

const getLoaderProp = curry((
  prop: typeof STATE | typeof FN,
  loaderType: LoaderType,
  state: GameState,
): LoaderState => (
  view(lensPath([STATE, ASSET_LOADERS, loaderType, prop]), state)
));
const setLoaderProp = curry((
  prop: typeof STATE | typeof FN,
  loaderType: LoaderType,
  state: GameState,
  loaderProp: LoaderState | LoaderFn,
): GameState => (
  assocPath([STATE, ASSET_LOADERS, loaderType, prop], loaderProp, state)
));

export const getLoaderState = getLoaderProp(STATE);
export const setLoaderState = setLoaderProp(STATE);
export const getLoaderFn = getLoaderProp(FN);
export const setLoaderFn = setLoaderProp(FN);

const loader = (initialLoaderState: LoaderState, {
  onStart,
  onProgress,
  onComplete,
  getLoaderState: getLoader,
  setLoaderState: setLoader,
}): LoaderFn => (state: GameState): GameState => {
  let loaderState = getLoader(state);
  if (!loaderState) loaderState = initialLoaderState;

  // ignore the loader if we've completed the load
  if (loaderState.completed) return state;
  // if we haven't started, start the loading process!
  else if (!loaderState.started) {
    return setLoader(state, onStart(loaderState));
  }
  // if we've started but we're not loading anymore, we're done
  else if (!loaderState.loading) {
    return setLoader(state, onComplete(loaderState));
  }
  // otherwise, assume loading is progressing
  return setLoader(state, onProgress(loaderState));
};

export default loader;
