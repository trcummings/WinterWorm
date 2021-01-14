import { ipcRenderer } from 'electron';
import { __ } from 'ramda';
import 'babel-polyfill';

import { REFRESH } from 'App/actionTypes';
import { getAssetPathAtlases } from 'Editor/aspects/AssetAtlases';
import { getNextState, applyMiddlewares } from './engine/ecs';
import { setGameState, applySpecs } from './engine/core';
import { gameLoop } from './engine/loop';
import {
  SCRIPTS,
  RENDER_ENGINE,
  ID_RECORD,
  EDITOR_TO_GAME,
} from './engine/symbols';
import { initEvents } from './engine/scripts';
import { getRenderEngine } from './engine/pixi';

import spriteLoader, { setSpriteLoaderFn } from './engine/loaders/spriteLoader';
import { makeLoaderState } from './engine/loaders/loader';
import { loggerMiddleware } from './engine/middlewares/loggerMiddleware';


export const makeInitialState = ({ renderEngine }) => applySpecs(
  {},
  // Add the render engine so that assets are cached when we load them in
  { type: RENDER_ENGINE,
    options: renderEngine },
  // set up a list of 1000 uuids for entities generated at run time to use
  { type: ID_RECORD },
  // Set up the events.
  { type: SCRIPTS, options: initEvents },
);

let runOnce = false;
const signalLoadComplete = (loaderState) => {
  if (!runOnce) {
    ipcRenderer.send(EDITOR_TO_GAME, [REFRESH]);
    runOnce = true;
  }
  // you HAVE TO return the loader state here otherwise things just loop
  return loaderState;
};

export const startGame = (initialState) => {
  // const {
  //   initialSpecs,
  //   initialEntitySpecs,
  // } = dataOptions;
  const startTime = performance.now();
  const { pixiLoader } = getRenderEngine(initialState);

  // build asset information to pass to the loader
  const atlases = getAssetPathAtlases();
  const initialAssetSpecs = Object.keys(atlases).map(resourceName => ({
    name: resourceName,
    path: atlases[resourceName].atlasPath,
  }));
  const assetLoader = spriteLoader(makeLoaderState({
    assetSpecs: initialAssetSpecs,
    pixiLoader,
    progress: 0,
  }), signalLoadComplete);

  const makeGameState = (extraSpecs = []) => setGameState(
    initialState,
    ...initialSpecs,
    { type: SCRIPTS,
      options: setSpriteLoaderFn(__, assetLoader) },
    ...extraSpecs
  );

  const middlewares = [];
  middlewares.push(loggerMiddleware);

  const update = applyMiddlewares(getNextState, ...middlewares);
  const start = gameLoop(window.requestAnimationFrame, makeGameState(), update);

  start(startTime);
};
