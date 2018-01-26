import { ipcRenderer } from 'electron';

import { setGameState } from './engine/core';
import { gameLoop } from './engine/loop';
import {
  // CURRENT_SCENE,
  // SYSTEMS,
  SCRIPTS,
  RENDER_ENGINE,
  PHYSICS_ENGINE,
} from './engine/symbols';
import { initEvents } from './engine/scripts';
import { createRenderingEngine } from './engine/pixi';
import { createPhysicsEngine } from './engine/planck';
import { isDev } from './engine/util';

// import { levelOne, levelOneLoader } from './spec/scenes';
// import { loader } from './spec/scenes/levelOneLoader';

const SYNC = 'sync';
const START_GAME = 'start_game';

// const setSystems = setSceneSystemSpecs(levelOneLoader.id, {
//   [loader.id]: loader,
// });
//
// const specs = [
//   { type: SCENES, options: levelOne },
//   { type: SCENES, options: levelOneLoader },
//   { type: CURRENT_SCENE, options: levelOneLoader.id },
//   { type: SCRIPTS, options: setSystems },
// ];


ipcRenderer.once(START_GAME, (_, specs) => {
  const loader = document.getElementById('loader');

  setTimeout(() => {
    document.body.removeChild(loader);

    const { canvas, renderer, stage, pixiLoader } = createRenderingEngine();
    const world = createPhysicsEngine();
    const gameState = setGameState(
      {},
      { type: RENDER_ENGINE,
        options: { renderer, stage, canvas, pixiLoader } },
      { type: PHYSICS_ENGINE,
        options: world },
      { type: SCRIPTS, options: initEvents },
      ...specs
    );

    console.log(gameState);

    gameLoop(gameState);
  }, 8000);
});

document.addEventListener('DOMContentLoaded', () => {
  if (isDev()) {
    require('./vendor/fpsMeter'); // eslint-disable-line
    window.meter = new window.FPSMeter();
  }

  ipcRenderer.send(SYNC);
});
