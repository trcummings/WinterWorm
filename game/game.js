import { setGameState, gameLoop } from './engine/core';
import { SCENES, CURRENT_SCENE, SCRIPTS, RENDER_ENGINE } from './engine/symbols';
import { initEvents, setSceneSystemSpecs } from './engine/scripts';
import { createRenderingEngine } from './engine/pixi';
import { isDev } from './engine/util';

import { levelOne, levelOneLoader } from './spec/scenes';
import { loader } from './spec/scenes/levelOneLoader';
// import { buttonPressDebug, position as positionC, utils } from './engine/components';
// import { isDev, makeId } from './engine/util';

// import player from './spec/player';

if (isDev()) require('./engine/fpsMeter'); // eslint-disable-line

// const texturePathByFrame = (loaderName, animName, ext = 'png') => frame => (
//   `${loaderName}/${animName}_${frame}.${ext}`
// );
//
// const makeTextureList = (allTextures, texturePathFn, numFrames) => {
//   const textures = [];
//   for (let i = 0; i < numFrames; i++) {
//     textures.push(allTextures[texturePathFn(i + 1)]);
//   }
//   return textures;
// };

document.addEventListener('DOMContentLoaded', () => {
  const { canvas, renderer, stage, pixiLoader } = createRenderingEngine();

  if (isDev()) window.meter = new window.FPSMeter();
  setTimeout(() => {
  // const loaderName = 'player';
  // pixiLoader
  //   .add(loaderName, './assets/player/player.json')
  //   .load((newLoader, resources) => {
  //     const animName = 'walk_l';
  //     const numFrames = 2;
  //     const texturePathFn = texturePathByFrame(loaderName, animName);
  //     const allTextures = resources[loaderName].textures;
  //     const walkLTexture = makeTextureList(allTextures, texturePathFn, numFrames);
  //     const sprite = new extras.AnimatedSprite(walkLTexture);
  //
  //     sprite.x = canvas.width / 2;
  //     sprite.y = canvas.height / 2;
  //     sprite.anchor.set(0.5);
  //     sprite.animationSpeed = 0.16;
  //     sprite.play();
  //     stage.addChild(sprite);
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
    // debug button
    // { type: ENTITIES,
    //   options: {
    //     id: makeId(ENTITIES),
    //     components: [
    //       { id: positionC.id, state: utils.setPositionState({ x: 300, y: 300, z: 1 }) },
    //       { id: buttonPressDebug.id, state: undefined },
    //     ],
    //   } },
    );

    console.log(gameState);

    gameLoop(gameState);
  });
});
