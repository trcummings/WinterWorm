import { setGameState, gameLoop } from './engine/core';
import { SCENES, CURRENT_SCENE, SCRIPTS, RENDER_ENGINE } from './engine/symbols';
import { initEvents, setSceneSystemSpecs } from './engine/scripts';
import { createRenderingEngine } from './engine/pixi';
import { isDev } from './engine/util';

import { levelOne, levelOneLoader } from './spec/scenes';
import { loader } from './spec/scenes/levelOneLoader';

if (isDev()) require('./vendor/fpsMeter'); // eslint-disable-line

document.addEventListener('DOMContentLoaded', () => {
  const { canvas, renderer, stage, pixiLoader } = createRenderingEngine();

  if (isDev()) window.meter = new window.FPSMeter();
  setTimeout(() => {
    const setSystems = setSceneSystemSpecs(levelOneLoader.id, {
      [loader.id]: loader,
    });

    const gameState = setGameState(
      {},
      { type: RENDER_ENGINE,
        options: { renderer, stage, canvas, pixiLoader } },
      { type: SCRIPTS, options: initEvents },
      { type: SCENES, options: levelOne },
      { type: SCENES, options: levelOneLoader },
      { type: CURRENT_SCENE, options: levelOneLoader.id },
      { type: SCRIPTS, options: setSystems },
    );

    console.log(gameState);

    gameLoop(gameState);
  }, 300);
});
