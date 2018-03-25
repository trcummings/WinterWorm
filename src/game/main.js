import { ipcRenderer } from 'electron';
import { __ } from 'ramda';
import 'babel-polyfill';

import { REFRESH } from 'App/actionTypes';
import { getNextState, applyMiddlewares } from './engine/ecs';
import { setGameState, applySpecs } from './engine/core';
import { gameLoop } from './engine/loop';
import {
  SCRIPTS,
  RENDER_ENGINE,
  PHYSICS_ENGINE,
  ID_RECORD,
  EDITOR_TO_GAME,
} from './engine/symbols';
import { initEvents } from './engine/scripts';
import { getRenderEngine } from './engine/pixi';
import { createPhysicsEngine } from './engine/planck';
import { isDev } from './engine/util';
import { gameSpecsToSpecs } from './engine/specUtil';

import spriteLoader, { setSpriteLoaderFn } from './engine/loaders/spriteLoader';
import { makeLoaderState } from './engine/loaders/loader';
import { setUpQueue, queueMiddleware } from './engine/middlewares/queueMiddleware';
import { loggerMiddleware } from './engine/middlewares/loggerMiddleware';

export const makeInitialState = ({ renderEngine }) => {
  const world = createPhysicsEngine();

  return applySpecs(
    {},
    // Add the render engine so that assets are cached when we load them in
    { type: RENDER_ENGINE,
      options: renderEngine },
    { type: PHYSICS_ENGINE,
      options: world },
    // set up a list of 1000 uuids for entities generated at run time to use
    { type: ID_RECORD },
    // Set up the events.
    { type: SCRIPTS, options: initEvents },
  );
};

let runOnce = false;
const signalLoadComplete = (loaderState) => {
  if (!runOnce) {
    ipcRenderer.send(EDITOR_TO_GAME, [REFRESH]);
    runOnce = true;
  }
  // you HAVE TO return the loader state here otherwise things just loop
  return loaderState;
};

export const startGame = (initialState, data) => {
  const {
    initialSpecs,
    initialAssetSpecs,
    initialEntitySpecs,
  } = gameSpecsToSpecs(data);
  const startTime = performance.now();
  const { pixiLoader } = getRenderEngine(initialState);

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

  const gameIpcMiddleware = queueMiddleware(
    initialEntitySpecs,
    makeGameState,
    setUpQueue()
  );

  // add middlewares for interacting with editor
  const middlewares = [];
  middlewares.push(gameIpcMiddleware);
  if (isDev()) middlewares.push(loggerMiddleware);

  const update = applyMiddlewares(getNextState, ...middlewares);
  const start = gameLoop(window.requestAnimationFrame, makeGameState(), update);

  start(startTime);
};
