import { ipcRenderer } from 'electron';

import { setGameState, gameLoop } from './engine/core';
import {
  SCENES,
  CURRENT_SCENE,
  SCRIPTS,
  RENDER_ENGINE,
  PHYSICS_ENGINE,
} from './engine/symbols';
import { initEvents, setSceneSystemSpecs } from './engine/scripts';
import { createRenderingEngine } from './engine/pixi';
import { createPhysicsEngine } from './engine/planck';
import { isDev } from './engine/util';

import { levelOne, levelOneLoader } from './spec/scenes';
import { loader } from './spec/scenes/levelOneLoader';

import { START_GAME, SYNC } from '../app/app';

ipcRenderer.on(START_GAME, (_, msg) => {
  console.log(msg);

  const setSystems = setSceneSystemSpecs(levelOneLoader.id, {
    [loader.id]: loader,
  });

  const specs = [
    { type: SCENES, options: levelOne },
    { type: SCENES, options: levelOneLoader },
    { type: CURRENT_SCENE, options: levelOneLoader.id },
    { type: SCRIPTS, options: setSystems },
  ];

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
});

document.addEventListener('DOMContentLoaded', () => {
  if (isDev()) {
    require('./vendor/fpsMeter'); // eslint-disable-line
    window.meter = new window.FPSMeter();
  }

  ipcRenderer.send(SYNC);
});
