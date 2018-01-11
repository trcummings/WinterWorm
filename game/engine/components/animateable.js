// @flow
import { makeId } from '../util';
import { COMPONENTS, ANIMATION_CHANGE } from '../symbols';

import type { Component } from '../types';

const getPrevFrame = (numFrames, currentFrame) => {
  if (currentFrame === 0) return numFrames - 1;
  return currentFrame - 1;
};

const getNextFrame = (numFrames, currentFrame) => {
  if (currentFrame === numFrames - 1) return 0;
  return currentFrame + 1;
};

const setSpriteForRender = (pastSprites, currentSprites, frame, spritesChanged) => {
  if (spritesChanged) pastSprites.renderable = false; //eslint-disable-line
  if (!currentSprites.renderable) currentSprites.renderable = true; //eslint-disable-line

  const numFrames = currentSprites.children.length;
  const prevFrame = getPrevFrame(numFrames, frame);
  const nextFrame = getNextFrame(numFrames, frame);

  currentSprites.children[prevFrame].renderable = false; // eslint-disable-line
  currentSprites.children[frame].renderable = true; // eslint-disable-line

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
  subscriptions: [ANIMATION_CHANGE],
  fn: (entityId, componentState, context) => {
    const { inbox } = context;
    const {
      // indexMap,
      nameMap,
      animation,
      currentAnimation,
      frame,
    } = componentState;
    const newAnimation = inbox.length ? inbox[inbox.length - 1] : currentAnimation;
    const pastSprites = animation.children[nameMap[currentAnimation]];
    const currentSprites = animation.children[nameMap[newAnimation]];
    const spritesChanged = currentAnimation !== newAnimation;
    const newFrame = setSpriteForRender(pastSprites, currentSprites, frame, spritesChanged);

    return { ...componentState, frame: newFrame };
  },
};

export { animateable };
