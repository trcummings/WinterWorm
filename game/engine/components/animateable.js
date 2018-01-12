// @flow
import { makeId } from '../util';
import { COMPONENTS, ANIMATION_CHANGE, TIME_TICK } from '../symbols';

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
  // if (spritesChanged) pastSprites.renderable = false; //eslint-disable-line
  if (!sprites.renderable) sprites.renderable = true; //eslint-disable-line

  const numFrames = sprites.children.length;
  const prevFrame = getPrevFrame(numFrames, frame);
  const nextFrame = getNextFrame(numFrames, frame);

  sprites.children[prevFrame].renderable = false; // eslint-disable-line
  sprites.children[frame].renderable = true; // eslint-disable-line

  return nextFrame;
};

const hasEventInInbox = eventType => (inbox) => {
  if (!inbox || inbox.length === 0) return undefined;
  const event = inbox.find(({ eventId }) => eventId === eventType);
  return event ? event.action : undefined;
};

const getAnimChange = hasEventInInbox(ANIMATION_CHANGE);
const getTimeTick = hasEventInInbox(TIME_TICK);

const ANIMATEABLE = 'animateable';
// When an action event is in the inbox, it changes the state and switches
// animations. Otherwise, the animation frame is incremented to the next
// frame as specified by the animation spec.
// a frame is a texture
const animateable: Component = {
  label: ANIMATEABLE,
  id: makeId(COMPONENTS),
  subscriptions: [ANIMATION_CHANGE, TIME_TICK],
  fn: (entityId, componentState, context) => {
    const { inbox } = context;
    const {
      nameMap,
      animation,
      animationSpecs,
      currentAnimation,
      tickAccum,
      frame,
    } = componentState;

    const animChange = getAnimChange(inbox);
    const timeTick = getTimeTick(inbox);
    const animIndex = nameMap[currentAnimation];
    const sprites = animation.children[animIndex];

    if (animChange) {
      const newSprites = animation.children[nameMap[animChange]];
      const newFrame = 0;

      sprites.renderable = false;
      newSprites.renderable = true;

      return { ...componentState, frame: newFrame, tickAccum: 0 };
    }
    else if (timeTick) {
      const fps = animationSpecs[currentAnimation].fps;
      const tickThreshold = 1000 / fps;

      let newTick = tickAccum + timeTick.frameTime;
      let newFrame = frame;

      if (newTick > tickThreshold) {
        newTick = 0;
        newFrame = setSpriteForRender(sprites, frame);
      }

      return { ...componentState, tickAccum: newTick, frame: newFrame };
    }

    return componentState;
  },
};

export { animateable };
