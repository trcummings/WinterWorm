// @flow

import { Application, loader, Texture, extras } from 'pixi.js';
import { times } from 'ramda';

import loop, { makeInitialLoopState, getDt } from './engine/loop';
import type { LoopState } from './engine/loop';

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

    const updateFn = (loopState: LoopState) => {
      console.log(getDt(loopState));
      anim.rotation += 0.01;
    };

    const initialLoopState = makeInitialLoopState(updateFn);

    loop(initialLoopState);
  });
});
