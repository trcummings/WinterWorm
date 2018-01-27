import { ipcRenderer } from 'electron';
import { __ } from 'ramda';

import { setGameState } from './engine/core';
import { gameLoop } from './engine/loop';
import {
  CURRENT_SCENE,
  SYSTEMS,
  SCENES,
  SCRIPTS,
  RENDER_ENGINE,
  PHYSICS_ENGINE,
} from './engine/symbols';
import { initEvents } from './engine/scripts';
import { createRenderingEngine } from './engine/pixi';
import { createPhysicsEngine } from './engine/planck';
import { isDev } from './engine/util';

import preCoreDevOnlySystems from './engine/systems/preCoreDevOnlySystems';
import coreSystems from './engine/systems/coreSystems';
import renderSystems from './engine/systems/renderSystems';
import postRenderDevOnlySystems from './engine/systems/postRenderDevOnlySystems';

// import { levelOne, levelOneLoader } from './spec/scenes';
// import { loader } from './spec/scenes/levelOneLoader';

import spriteLoader, { setSpriteLoaderFn } from './engine/loaders/spriteLoader';
import { makeLoaderState } from './engine/loaders/loader';
import { animationLoaderSpec } from './spec/player';

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

const systemList = [
  ...preCoreDevOnlySystems,
  ...coreSystems,
  ...renderSystems,
  ...postRenderDevOnlySystems,
];

const systemIds = systemList.map(({ id }) => id);
const systemMap = systemList.reduce((total, system) => (
  Object.assign(total, { [system.id]: system })
), {});

function specsToGameSpecs(specs) {
  const [sceneId] = Object.keys(specs.scenes || {});
  const scene = specs.scenes[sceneId];

  return [
    { type: SCENES,
      options: {
        ...scene, systems: systemIds,
      } },
    { type: CURRENT_SCENE,
      options: sceneId },
    ...systemIds.map(id => ({
      type: SYSTEMS, options: systemMap[id],
    })),
  ];
}

ipcRenderer.once(START_GAME, (_, specs) => {
  const loader = document.getElementById('loader');
  const gameSpecs = specsToGameSpecs(specs);

  setTimeout(() => {
    document.body.removeChild(loader);

    const { canvas, renderer, stage, pixiLoader } = createRenderingEngine();
    document.body.appendChild(canvas);

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
