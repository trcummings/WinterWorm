// @flow
// system for updating loaders
import { getLoaderTypes, getLoaderFn } from 'Game/engine/loaders/loader';

import type { GameState } from 'Types';

const runLoaderCycle = (state: GameState, loaderType): GameState => {
  const loaderFn = getLoaderFn(loaderType, state);
  return loaderFn(state);
};

export default (state: GameState): GameState => {
  const loaderTypes = getLoaderTypes(state);
  return loaderTypes.reduce(runLoaderCycle, state);
};
