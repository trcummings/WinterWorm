import { ipcRenderer } from 'electron';
import { __ } from 'ramda';

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

const SYNC = 'sync';
const START_GAME = 'start_game';

const swapLoaderWithCanvas = (canvas) => {
  const loader = document.getElementById('loader');
  document.body.style['background-color'] = '#000000';
  document.body.removeChild(loader);
  document.body.appendChild(canvas);
};

ipcRenderer.once(START_GAME, (_, { specs, config }) => {
  const gameSpecs = gameSpecsToSpecs(specs);

  setTimeout(() => {
    const { canvas, renderer, stage, pixiLoader } = createRenderingEngine(config);
    swapLoaderWithCanvas(canvas);

    const assetLoader = spriteLoader(makeLoaderState({
      assetSpecs: [animationLoaderSpec],
      pixiLoader,
      progress: 0,
    }));

    const world = createPhysicsEngine();
    const gameState = setGameState(
      {},
      { type: RENDER_ENGINE,
        options: { renderer, stage, canvas, pixiLoader } },
      { type: PHYSICS_ENGINE,
        options: world },
      { type: SCRIPTS, options: initEvents },
      { type: SCRIPTS, options: setSpriteLoaderFn(__, assetLoader) },
      ...gameSpecs
    );

    console.log(gameState);

    gameLoop(gameState);
  }, 2000);
});

document.addEventListener('DOMContentLoaded', () => {
  if (isDev()) {
    require('./vendor/fpsMeter'); // eslint-disable-line
    window.meter = new window.FPSMeter();
  }

  ipcRenderer.send(SYNC);
});
