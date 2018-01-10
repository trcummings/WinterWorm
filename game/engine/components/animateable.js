// @flow
import { makeId } from '../util';
import { COMPONENTS } from '../symbols';

import type { Component } from '../types';

const getPrevFrame = (numFrames, currentFrame) => {
  if (currentFrame === 0) return numFrames - 1;
  return currentFrame - 1;
};

const getNextFrame = (numFrames, currentFrame) => {
  if (currentFrame === numFrames - 1) return 0;
  return currentFrame + 1;
};

const setSpriteForRender = (sprites, frame) => {
  if (!sprites.renderable) sprites.renderable = true; //eslint-disable-line

  const numFrames = sprites.children.length;
  const prevFrame = getPrevFrame(numFrames, frame);
  const nextFrame = getNextFrame(numFrames, frame);

  sprites.children[prevFrame].renderable = false; // eslint-disable-line
  sprites.children[frame].renderable = true; // eslint-disable-line

  return nextFrame;
};

const ANIMATEABLE = 'animateable';
// When an action event is in the inbox, it changes the state and switches
// animations. Otherwise, the animation frame is incremented to the next
// frame as specified by the animation spec.
// a frame is a texture
const animateable: Component = {
  label: ANIMATEABLE,
  id: makeId(COMPONENTS),
  fn: (entityId, componentState) => {
    // const { inbox } = context;
    const {
      // indexMap,
      nameMap,
      animation,
      currentAnimation,
      frame,
    } = componentState;
    const animIndex = nameMap[currentAnimation];
    const nextFrame = setSpriteForRender(animation.children[animIndex], frame);

    return { ...componentState, frame: nextFrame };
  },
};

export { animateable };
