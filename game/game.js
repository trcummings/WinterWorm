import { Application, Texture, extras, loader } from 'pixi.js';
import { times } from 'ramda';

import { setGameState, gameLoop } from './engine/core';
import { SCENES, CURRENT_SCENE, SYSTEMS, SCRIPTS, RENDER_ENGINE } from './engine/symbols';

import { initEvents } from './engine/scripts';
import { animation, meta, clearEventQueue, render } from './engine/systems';

import { levelOne, levelOneId } from './spec/scenes/levelOne';

require('./engine/utils/fpsMeter');

document.addEventListener('DOMContentLoaded', () => {
  const app = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
  });
  const canvas = app.view;
  const renderer = app.renderer;
  const stage = app.stage;
  const screen = app.screen;

  document.body.appendChild(canvas);

  window.meter = new window.FPSMeter();

  loader.add('spritesheet', './assets/player/idle/idle.json').load(() => {
    const frames = times(() => Texture.fromImage('./assets/player/idle/idle.png'), 1);
    const anim = new extras.AnimatedSprite(frames);

    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    anim.x = screen.width / 2;
    anim.y = screen.height / 2;
    anim.anchor.set(0.5);
    anim.animationSpeed = 0.5;
    anim.play();

    stage.addChild(anim);

    const animSystem = animation(anim);
    const animSystemId = animSystem.id;

    const gameState = setGameState(
      {},
      { type: RENDER_ENGINE, options: { renderer, stage } },
      { type: SCRIPTS, options: initEvents },
      { type: SCENES, options: levelOne(animSystemId) },
      { type: CURRENT_SCENE, options: levelOneId },
      { type: SYSTEMS, options: animSystem },
      { type: SYSTEMS, options: meta },
      { type: SYSTEMS, options: render },
      { type: SYSTEMS, options: clearEventQueue },
    );

    console.log(gameState);
    gameLoop(gameState);
  });
});
