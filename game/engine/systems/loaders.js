// @flow
// system for updating loaders
import { makeId } from '../util';
import { SYSTEMS } from '../symbols';
import { getLoaderTypes, getLoaderFn } from '../loaders/loader';

import type { System, GameState } from '../types';

const LOADERS = 'loaders';

const runLoaderCycle = (state: GameState, loaderType): GameState => {
  const loaderFn = getLoaderFn(loaderType, state);
  return loaderFn(state);
};

const loaders: System = {
  label: LOADERS,
  id: makeId(SYSTEMS),
  fn: (state: GameState): GameState => {
    const loaderTypes = getLoaderTypes(state);
    return loaderTypes.reduce(runLoaderCycle, state);
  },
};

export default loaders;
