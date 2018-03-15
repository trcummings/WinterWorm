// @flow
// spriteLoader.js: system for loading sprite texture atlases through
//                  the PIXI.js asset loader.
//
// on load of assets it adds the loaded resources to the state, and then
// switches to a given sceneId through a meta event dispatch of a changeScene
// script.
import { makeId } from '../util';
import { SYSTEMS, SCRIPTS, ENTITIES } from '../symbols';
import { getRenderEngine } from '../pixi';
import { emitMetaEvent } from '../events';
import { changeScene } from '../scripts';
import makePlayer from '../../spec/player';
import floor from '../../spec/floor';

import type { System, GameState, Id } from '../types';

type AssetSpec = {
  name: string,
  atlasPath: string,
};

// let resources;
let loading;
let progress;
let completed;
let switching;

const onProgress = (_loader) => {
  progress = _loader.progress;
  console.log(progress);
};

const onLoad = () => {
  progress = undefined;
  loading = undefined;
  completed = true;
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
    if (!loading && !completed) {
      startLoader(assetSpecs, getRenderEngine(state).pixiLoader);
    }
    else if (completed && !switching) {
      switching = true;

      // dispatch a meta action to switch to the next scene
      const next = emitMetaEvent(state, {
        type: SCRIPTS,
        options: changeScene(
          nextSceneId,
          { type: SCRIPTS, options: makePlayer },
          { type: ENTITIES, options: floor },
        ),
      });

      console.log(next);
      return next;
    }
    return state;
  },
});

export default spriteLoader;
