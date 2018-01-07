import { loader, extras } from 'pixi.js';

import { setGameState, gameLoop } from './engine/core';
import { SCENES, CURRENT_SCENE, SYSTEMS, SCRIPTS, RENDER_ENGINE, ENTITIES } from './engine/symbols';
import { initEvents } from './engine/scripts';
import { meta, clearEventQueue, render, graphicsRect, position, boundingBox, input } from './engine/systems';
import { isDev, makeId } from './engine/util';
import { createRenderingEngine } from './engine/pixi';
import player from './spec/player';

if (isDev()) require('./engine/fpsMeter'); // eslint-disable-line

const texturePathByFrame = (loaderName, animName, ext = 'png') => frame => (
  `${loaderName}/${animName}_${frame}.${ext}`
);

const makeTextureList = (allTextures, texturePathFn, numFrames) => {
  const textures = [];
  for (let i = 0; i < numFrames; i++) {
    textures.push(allTextures[texturePathFn(i + 1)]);
  }
  return textures;
};

document.addEventListener('DOMContentLoaded', () => {
  const { canvas, renderer, stage } = createRenderingEngine();

  if (isDev()) window.meter = new window.FPSMeter();
  const loaderName = 'player';
  loader
    .add(loaderName, './assets/player/player.json')
    .load((newLoader, resources) => {
      const animName = 'walk_l';
      const numFrames = 2;
      const texturePathFn = texturePathByFrame(loaderName, animName);
      const allTextures = resources[loaderName].textures;
      const walkLTexture = makeTextureList(allTextures, texturePathFn, numFrames);
      const sprite = new extras.AnimatedSprite(walkLTexture);

      sprite.x = canvas.width / 2;
      sprite.y = canvas.height / 2;
      sprite.anchor.set(0.5);
      sprite.animationSpeed = 0.16;
      sprite.play();
      stage.addChild(sprite);

      const levelOneId = makeId(SCENES);

      const gameState = setGameState(
        {},
        { type: RENDER_ENGINE, options: { renderer, stage, canvas } },
        { type: SCRIPTS, options: initEvents },
        { type: SCENES,
          options: {
            id: levelOneId,
            systems: [
              input.id,
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
        // system for tracking keyboard input events
        { type: SYSTEMS, options: input },
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
      );

      console.log(gameState);

      gameLoop(gameState);
    });
});
