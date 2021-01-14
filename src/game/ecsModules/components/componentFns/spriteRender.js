import { setTransform } from 'Game/engine/pixi';
import { ANIMATION_CHANGE, RENDER_ACTION, FRAME_CHANGE } from 'Engine/symbols';
import { hasEventInInbox, makeEvent } from 'Engine/events';

const pushToRenderEvents = (renderEvents, fn) => {
  renderEvents.push(makeEvent(fn, [RENDER_ACTION]));
};

const getAnimChange = hasEventInInbox(ANIMATION_CHANGE);
const getFrameChange = hasEventInInbox(FRAME_CHANGE);

const getPrevFrame = (numFrames, currentFrame) => {
  if (currentFrame === 0) return numFrames - 1;
  return currentFrame - 1;
};

const getNextFrame = (numFrames, currentFrame) => {
  if (currentFrame === numFrames - 1) return 0;
  return currentFrame + 1;
};

const setSpriteForRender = (sprites, frame, renderEvents) => {
  const numFrames = sprites.children.length;
  const prevFrame = getPrevFrame(numFrames, frame);
  const nextFrame = getNextFrame(numFrames, frame);

  pushToRenderEvents(renderEvents, () => {
    if (!sprites.renderable) sprites.renderable = true; //eslint-disable-line

    sprites.children[prevFrame].renderable = false; // eslint-disable-line
    sprites.children[prevFrame].filters = null; // eslint-disable-line

    sprites.children[frame].renderable = true; // eslint-disable-line
  });

  return nextFrame;
};

export const getCurrentSprite = (animateable) => {
  const { nameMap, animation, currentAnimation, currentFrame } = animateable;
  const sprites = animation.children[nameMap[currentAnimation]];
  const currentSprite = sprites.children[currentFrame];

  return currentSprite;
};

// When an action event is in the inbox, it changes the state and switches
// animations. Otherwise, the animation frame is incremented to the next
// frame as specified by the animation spec.
// a frame is a texture

export default (entityId, componentState, context) => {
  const {
    inbox,
    displayContainerable: { displayContainer: animation },
    positionable: { x, y } = {},
  } = context;
  const { nameMap, currentAnimation, currentFrame } = componentState;

  const animChange = getAnimChange(inbox);
  const frameChange = getFrameChange(inbox);

  const animIndex = nameMap[currentAnimation];
  const sprites = animation.children[animIndex];
  const animationChanged = animChange && animChange !== currentAnimation;
  const frameChanged = frameChange !== undefined && frameChange !== currentFrame;
  const renderEvents = [];

  let newFrame = currentFrame;
  let newSprites = sprites;
  let newCurrentAnimation = currentAnimation;

  if (animationChanged) {
    newCurrentAnimation = animChange;
    newSprites = animation.children[nameMap[newCurrentAnimation]];

    // add a render event to the queue to turn off the current sprite
    pushToRenderEvents(renderEvents, () => {
      sprites.renderable = false;
    });
  }

  if (frameChanged) newFrame = setSpriteForRender(newSprites, newFrame, renderEvents);

  // if we had an update we want to make sure there was no frame
  // mutation somewhere in there by catching double frame cases and no
  // frame cases
  if (animationChanged || frameChanged) {
    pushToRenderEvents(renderEvents, () => {
      const spritesEqual = sprites === newSprites;
      if (spritesEqual) return;
      if (sprites.renderable && newSprites.renderable) {
        sprites.renderable = false;
      }
      else if (!sprites.renderable && !newSprites.renderable) {
        newSprites.renderable = true;
      }
    });
  }

  pushToRenderEvents(renderEvents, () => {
    if (animation.x !== x || animation.y !== y) setTransform(animation, x, y);
  });

  return [{
    ...componentState,
    currentFrame: newFrame,
    currentAnimation: newCurrentAnimation,
  }, renderEvents];
};
