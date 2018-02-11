import { ipcRenderer } from 'electron';
import { __ } from 'ramda';

import { getNextState, applyMiddlewares } from './engine/ecs';
import { setGameState, applySpecs } from './engine/core';
import { gameLoop } from './engine/loop';
import {
  SCRIPTS,
  RENDER_ENGINE,
  PHYSICS_ENGINE,
} from './engine/symbols';
import { initEvents } from './engine/scripts';
import { createRenderingEngine, getRenderEngine } from './engine/pixi';
import { createPhysicsEngine } from './engine/planck';
import { isDev } from './engine/util';
import { gameSpecsToSpecs } from './engine/specUtil';

import spriteLoader, { setSpriteLoaderFn } from './engine/loaders/spriteLoader';
import { makeLoaderState } from './engine/loaders/loader';
import { animationLoaderSpec } from './spec/player';
import { setUpFpsMeter } from './engine/utils/fpsMeterUtil';
import { setUpQueue, queueMiddleware } from './engine/queueMiddleware';
import { loggerMiddleware } from './engine/loggerMiddleware';

import {
  SYNC,
  START_GAME,
  MAXIMIZE,
} from '../app/actionTypes';

const swapLoaderWithCanvas = () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  document.body.style['background-color'] = '#000000';
  document.body.removeChild(loader);
};

const makeInitialState = (config) => {
  const { canvas, renderer, stage, pixiLoader } = createRenderingEngine(config);
  document.body.appendChild(canvas);

  const renderEngine = { renderer, stage, canvas, pixiLoader };
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

const maximizeAfterLoad = (state) => {
  if (!isDev()) ipcRenderer.send(MAXIMIZE);
  swapLoaderWithCanvas();
  return state;
};

ipcRenderer.once(START_GAME, (_, { specs, config }) => {
  const startTime = performance.now();
  const initialGameState = makeInitialState(config);
  const initialSpecs = gameSpecsToSpecs(specs);
  const { pixiLoader } = getRenderEngine(initialGameState);

  const assetLoader = spriteLoader(makeLoaderState({
    assetSpecs: [animationLoaderSpec],
    pixiLoader,
    progress: 0,
  }), maximizeAfterLoad);

  const makeGameState = () => setGameState(
    initialGameState,
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
});

document.addEventListener('DOMContentLoaded', () => {
  if (isDev()) setUpFpsMeter();
  ipcRenderer.send(SYNC);
});
