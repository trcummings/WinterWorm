// @flow

import { Application, loader, Texture, extras } from 'pixi.js';
import { times } from 'ramda';

import { makeGameState } from './engine/gameState';
import { getUpdateFn } from './engine/ecs';
import loop, { makeInitialLoopState } from './engine/loop';
import { SCENES, ID, CURRENT_SCENE, SYSTEMS } from './engine/symbols';

import { animation } from './engine/systems/animation';

import { levelOne, levelOneId } from './spec/scenes/levelOne';

document.addEventListener('DOMContentLoaded', () => {
  console.log('dom content loaded');

  const app = new Application(800, 600, { backgroundColor: 0x1099bb });
  document.body.appendChild(app.view);

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

    const animSystem = animation(anim);
    const animSystemId = animSystem[ID];

    const gameState = makeGameState(
      {},
      [SCENES, levelOne(animSystemId)],
      [CURRENT_SCENE, { [ID]: levelOneId }],
      [SYSTEMS, animSystem],
    );

    const updateFn = getUpdateFn(gameState);

    const initialLoopState = makeInitialLoopState(updateFn);

    loop(initialLoopState);
  });
});
