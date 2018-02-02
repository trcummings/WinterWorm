import { ipcRenderer } from 'electron';
import { __, partial } from 'ramda';

import { getNextState, applyMiddlewares } from './engine/ecs';
import { setGameState } from './engine/core';
import { gameLoop } from './engine/loop';
import {
  SCRIPTS,
  RENDER_ENGINE,
  PHYSICS_ENGINE,
} from './engine/symbols';
import { initEvents } from './engine/scripts';
import { createRenderingEngine } from './engine/pixi';
import { createPhysicsEngine } from './engine/planck';
import { isDev } from './engine/util';
import { gameSpecsToSpecs } from './engine/specUtil';

import spriteLoader, { setSpriteLoaderFn } from './engine/loaders/spriteLoader';
import { makeLoaderState } from './engine/loaders/loader';
import { animationLoaderSpec } from './spec/player';
import { setUpFpsMeter } from './engine/utils/fpsMeterUtil';

import {
  SYNC,
  START_GAME,
  MAXIMIZE,
} from '../app/actionTypes';

const swapLoaderWithCanvas = () => {
  // document.body.appendChild(canvas);
  const loader = document.getElementById('loader');
  document.body.style['background-color'] = '#000000';
  document.body.removeChild(loader);
};

ipcRenderer.once(START_GAME, (_, { specs, config }) => {
  const gameSpecs = gameSpecsToSpecs(specs);
  const startTime = performance.now();

  const { canvas, renderer, stage, pixiLoader } = createRenderingEngine(config);
  document.body.appendChild(canvas);

  const renderEngine = { renderer, stage, canvas, pixiLoader };
  const world = createPhysicsEngine();

  const partialGame = (...s) => setGameState(
    {},
    { type: RENDER_ENGINE,
      options: renderEngine },
    { type: PHYSICS_ENGINE,
      options: world },
    { type: SCRIPTS, options: initEvents },
    ...s,
  );

  const assetLoader = spriteLoader(makeLoaderState({
    assetSpecs: [animationLoaderSpec],
    pixiLoader,
    progress: 0,
  }), (...args) => {
    if (!isDev()) ipcRenderer.send(MAXIMIZE);

    swapLoaderWithCanvas(canvas);
    return args;
  });

  const gameState = partialGame(
    { type: SCRIPTS, options: setSpriteLoaderFn(__, assetLoader) },
    ...gameSpecs
  );

  const update = applyMiddlewares(getNextState);
  const start = gameLoop(window.requestAnimationFrame, gameState, update);

  start(startTime);
});

document.addEventListener('DOMContentLoaded', () => {
  if (isDev()) setUpFpsMeter();
  ipcRenderer.send(SYNC);
});
