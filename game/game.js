import { Application, loader, Texture, extras } from 'pixi.js';
import { times } from 'ramda';

import { setGameState } from './engine/core';
import { getUpdateFn } from './engine/ecs';
import loop, { makeInitialLoopState } from './engine/loop';
import { SCENES, CURRENT_SCENE, SYSTEMS, SCRIPTS } from './engine/symbols';

import { initEvents } from './engine/scripts';
import { animation, meta } from './engine/systems';

import { levelOne, levelOneId } from './spec/scenes/levelOne';

require('./engine/utils/fpsMeter');

document.addEventListener('DOMContentLoaded', () => {
  const app = new Application(800, 600, { backgroundColor: 0x1099bb });
  document.body.appendChild(app.view);

  const fpsMeter = new window.FPSMeter();

  loader.add('spritesheet', './assets/player/idle/idle.json').load(() => {
    const frames = times(() => Texture.fromImage('./assets/player/idle/idle.png'), 1);

    const anim = new extras.AnimatedSprite(frames);

    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    anim.x = app.screen.width / 2;
    anim.y = app.screen.height / 2;
    anim.anchor.set(0.5);
    anim.animationSpeed = 0.5;
    anim.play();

    app.stage.addChild(anim);

    const animSystem = animation(anim, fpsMeter);
    const animSystemId = animSystem.id;

    const gameState = setGameState(
      {},
      { type: SCRIPTS, options: initEvents },
      { type: SCENES, options: levelOne(animSystemId) },
      { type: CURRENT_SCENE, options: { id: levelOneId } },
      { type: SYSTEMS, options: animSystem },
      { type: SYSTEMS, options: meta }
    );

    const updateFn = getUpdateFn(gameState);

    const initialLoopState = makeInitialLoopState(updateFn);

    loop(initialLoopState);
  });
});
