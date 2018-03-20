// @flow
import { compose } from 'ramda';
import loader, {
  getLoaderState,
  setLoaderState,
  getLoaderFn,
  setLoaderFn,
} from './loader';
import { SPRITE_LOADER } from '../symbols';

import type { LoaderState, LoaderFn } from './loader';

const addLoaderItem = (pixiLoader, spec) => (
  pixiLoader.resources[spec.name]
    ? pixiLoader
    : pixiLoader.add(spec.name, spec.path)
);

const onProgress = (loaderState: LoaderState): LoaderState => {
  const { meta: { progress, pixiLoader } } = loaderState;
  if (pixiLoader.progress === progress) return loaderState;

  return {
    ...loaderState,
    loading: pixiLoader.loading,
    meta: { ...loaderState.meta, progress: pixiLoader.progress },
  };
};

const onStart = (loaderState: LoaderState): LoaderState => {
  const { meta: { pixiLoader, assetSpecs } } = loaderState;
  assetSpecs.reduce(addLoaderItem, pixiLoader).load(() => {});

  return { ...loaderState, started: true, loading: true };
};

const onComplete = (loaderState: LoaderState): LoaderState => ({
  ...loaderState,
  completed: true,
});

const getSpriteLoaderState = getLoaderState(SPRITE_LOADER);
const setSpriteLoaderState = setLoaderState(SPRITE_LOADER);
export const getSpriteLoaderFn = getLoaderFn(SPRITE_LOADER);
export const setSpriteLoaderFn = setLoaderFn(SPRITE_LOADER);

const spriteLoader = (initialLoaderState: LoaderState, onLoaderComplete = () => {}): LoaderFn => (
  loader(initialLoaderState, {
    onStart,
    onProgress,
    onComplete: compose(onLoaderComplete, onComplete),
    getLoaderState: getSpriteLoaderState,
    setLoaderState: setSpriteLoaderState,
  })
);

export default spriteLoader;
