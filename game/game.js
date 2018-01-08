import { loader, extras } from 'pixi.js';

import { setGameState, gameLoop } from './engine/core';
import { SCENES, CURRENT_SCENE, SYSTEMS, SCRIPTS, RENDER_ENGINE, ENTITIES } from './engine/symbols';
import { initEvents } from './engine/scripts';
import { buttonPressDebug, position as positionC, utils } from './engine/components';
import { meta, clearEventQueue, render, graphicsRect, position, boundingBox, input, inputDebug } from './engine/systems';
import { isDev, makeId } from './engine/util';
import { createRenderingEngine } from './engine/pixi';

import player from './spec/player';
import { levelOne } from './spec/scenes';

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

      const gameState = setGameState(
        {},
        { type: RENDER_ENGINE, options: { renderer, stage, canvas } },
        { type: SCRIPTS, options: initEvents },
        { type: SCENES, options: levelOne },
        { type: CURRENT_SCENE, options: levelOne.id },
        // system for listening to keyboard input events
        { type: SYSTEMS, options: input },
        // system for debugging keyboard input events
        { type: SYSTEMS, options: inputDebug },
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
        // debug button
        { type: ENTITIES,
          options: {
            id: makeId(ENTITIES),
            components: [
              { id: positionC.id, state: utils.setPositionState({ x: 300, y: 300, z: 1 }) },
              { id: buttonPressDebug.id, state: undefined },
            ],
          } },
      );

      console.log(gameState);

      gameLoop(gameState);
    });
});
