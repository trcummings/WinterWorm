import { __ } from 'ramda';
import 'babel-polyfill';

import { getNextState, applyMiddlewares } from './engine/ecs';
import { setGameState, applySpecs } from './engine/core';
import { gameLoop } from './engine/loop';
import {
  SCRIPTS,
  RENDER_ENGINE,
  PHYSICS_ENGINE,
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
    // Set up the events.
    { type: SCRIPTS, options: initEvents },
  );
};

export const startGame = (initialState, data) => {
  const initialSpecs = gameSpecsToSpecs(data);
  const startTime = performance.now();
  const { pixiLoader } = getRenderEngine(initialState);

  const assetLoader = spriteLoader(makeLoaderState({
    assetSpecs: [],
    pixiLoader,
    progress: 0,
  }));

  console.log(initialState, initialSpecs);

  const makeGameState = () => setGameState(
    initialState,
    { type: SCRIPTS,
      options: setSpriteLoaderFn(__, assetLoader) },
    ...initialSpecs
  );

  const ipcMiddleware = queueMiddleware(
    makeGameState,
    setUpQueue()
  );

  // add middlewares for interacting with editor
  const middlewares = [];
  middlewares.push(ipcMiddleware);
  if (isDev()) middlewares.push(loggerMiddleware);

  const update = applyMiddlewares(getNextState, ...middlewares);
  const start = gameLoop(window.requestAnimationFrame, makeGameState(), update);

  start(startTime);
};
