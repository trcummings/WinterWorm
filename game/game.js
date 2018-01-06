import { setGameState, gameLoop } from './engine/core';
import { SCENES, CURRENT_SCENE, SYSTEMS, SCRIPTS, RENDER_ENGINE, ENTITIES } from './engine/symbols';
import { initEvents, setupAllComponents } from './engine/scripts';
import { meta, clearEventQueue, render, graphicsRect, position, boundingBox } from './engine/systems';
import { isDev, makeId } from './engine/util';
import { createRenderingEngine } from './engine/pixi';
import player from './spec/player';

if (isDev()) require('./engine/fpsMeter'); // eslint-disable-line

document.addEventListener('DOMContentLoaded', () => {
  const { canvas, renderer, stage } = createRenderingEngine();

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
          meta.id,
          position.id,
          boundingBox.id,
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
    // system for height and width of an entity
    { type: SYSTEMS, options: boundingBox },
    // system for rendering the PIXI.js stage + fpsMeter
    { type: SYSTEMS, options: render },
    // system for clearing out the event queue at the end of the system fn
    { type: SYSTEMS, options: clearEventQueue },
    // the player
    { type: ENTITIES, options: player },
    // run at the end to set up all the components with setupFns
    { type: SCRIPTS, options: setupAllComponents }
  );

  console.log(gameState);

  gameLoop(gameState);
});
