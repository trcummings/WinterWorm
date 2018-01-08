// @flow
// spriteLoader.js: system for loading sprite texture atlases through
//                  the PIXI.js asset loader.
import { makeId } from '../util';
import { SYSTEMS } from '../symbols';
import { getRenderEngine } from '../pixi';

import type { System, GameState } from '../types';

type AssetSpec = {
  name: string,
  atlasPath: string,
};

let resources;
let loading;
let progress;

const onProgress = (_loader, resource) => {
  progress = _loader.progress;
  console.log(resource, progress);
};

const onLoad = (_, _resources) => {
  console.log('loaded!');
  progress = undefined;
  loading = undefined;
  resources = _resources;
};

const onStart = () => {
  loading = true;
};

const addLoaderItem = (pixiLoader, { name, path }) => pixiLoader.add(name, path);

const startLoader = (assetSpecs: Array<AssetSpec>, loader) => {
  assetSpecs
    .reduce(addLoaderItem, loader)
    .on('progress', onProgress)
    .on('start', onStart)
    .load(onLoad);
};

const spriteLoader = (assetSpecs: Array<AssetSpec>): System => ({
  id: makeId(SYSTEMS),
  fn: (state: GameState): GameState => {
    // if we haven't loaded anything, lets start that process
    if (!resources) {
      const renderEngine = getRenderEngine(state);
      const loader = renderEngine.pixiLoader;
      if (!loading) startLoader(assetSpecs, loader);
    }
    return state;
  },
});

export default spriteLoader;
