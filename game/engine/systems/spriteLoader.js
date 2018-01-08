// @flow
// spriteLoader.js: system for loading sprite texture atlases through
//                  the PIXI.js asset loader.
import { makeId } from '../util';
import { SYSTEMS, SCRIPTS } from '../symbols';
import { getRenderEngine } from '../pixi';
import { emitMetaEvent } from '../events';
import { changeScene } from '../scripts';

import type { System, GameState, Id } from '../types';

type AssetSpec = {
  name: string,
  atlasPath: string,
};

let resources;
let loading;
let progress;
let completed;
let switching;

const onProgress = (_loader) => {
  progress = _loader.progress;
  console.log(`${progress}% loaded`);
};

const onLoad = (_, _resources) => {
  console.log('loaded!');
  progress = undefined;
  loading = undefined;
  completed = true;
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

const spriteLoader = (assetSpecs: Array<AssetSpec>, nextSceneId: Id): System => ({
  id: makeId(SYSTEMS),
  fn: (state: GameState): GameState => {
    // if we haven't loaded anything, lets start that process
    if (!loading && !completed) startLoader(assetSpecs, getRenderEngine(state).pixiLoader);
    else if (completed && !switching) {
      switching = true;
      console.log(resources);
      // dispatch a meta action to switch to the next scene
      return emitMetaEvent(state, { type: SCRIPTS, options: changeScene(nextSceneId) });
    }
    console.log(state);
    return state;
  },
});

export default spriteLoader;
