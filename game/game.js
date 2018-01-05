import { Application } from 'pixi.js';

import { setGameState, gameLoop } from './engine/core';
import { SCENES, CURRENT_SCENE, SYSTEMS, SCRIPTS, RENDER_ENGINE, ENTITIES } from './engine/symbols';
import { initEvents } from './engine/scripts';
import { meta, clearEventQueue, render, graphicsRect, position } from './engine/systems';
import { isDev, makeId } from './engine/util';
import player from './spec/player';

if (isDev()) require('./engine/utils/fpsMeter'); // eslint-disable-line

document.addEventListener('DOMContentLoaded', () => {
  const app = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    autoStart: false,
  });
  const canvas = app.view;
  const renderer = app.renderer;
  const stage = app.stage;

  document.body.appendChild(canvas);

  if (isDev()) window.meter = new window.FPSMeter();

  const levelOneId = makeId(SCENES);

  const gameState = setGameState(
    {},
    { type: RENDER_ENGINE, options: { renderer, stage, canvas } },
    { type: SCRIPTS, options: initEvents },
    { type: SCENES,
      options: {
        id: levelOneId,
        systems: [
          position.id,
          meta.id,
          graphicsRect.id,
          render.id,
          clearEventQueue.id,
        ],
      },
    },
    { type: CURRENT_SCENE, options: levelOneId },
    // system for x, y, z stage placement
    { type: SYSTEMS, options: position },
    // system for meta events like adding/removing entities
    { type: SYSTEMS, options: meta },
    // system for rendering graphical rectangles
    { type: SYSTEMS, options: graphicsRect },
    // system for rendering the PIXI.js stage + fpsMeter
    { type: SYSTEMS, options: render },
    // system for clearing out the event queue at the end of the system fn
    { type: SYSTEMS, options: clearEventQueue },
    // the player
    { type: ENTITIES, options: player }
  );

  console.log(gameState);

  gameLoop(gameState);
});
