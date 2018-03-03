import { ANIMATION_CHANGE, TIME_TICK, RENDER_ACTION } from '../symbols';
import { hasEventInInbox, makeEvent } from '../events';

const getPrevFrame = (numFrames, currentFrame) => {
  if (currentFrame === 0) return numFrames - 1;
  return currentFrame - 1;
};

const getNextFrame = (numFrames, currentFrame) => {
  if (currentFrame === numFrames - 1) return 0;
  return currentFrame + 1;
};

const pushToRenderEvents = (renderEvents, fn) => {
  renderEvents.push(makeEvent(fn, [RENDER_ACTION]));
};

const setSpriteForRender = (sprites, frame, renderEvents) => {
  const numFrames = sprites.children.length;
  const prevFrame = getPrevFrame(numFrames, frame);
  const nextFrame = getNextFrame(numFrames, frame);

  pushToRenderEvents(renderEvents, () => {
    if (!sprites.renderable) sprites.renderable = true; //eslint-disable-line
    sprites.children[prevFrame].renderable = false; // eslint-disable-line
    sprites.children[frame].renderable = true; // eslint-disable-line
  });

  return nextFrame;
};

const getAnimChange = hasEventInInbox(ANIMATION_CHANGE);
const getTimeTick = hasEventInInbox(TIME_TICK);

// When an action event is in the inbox, it changes the state and switches
// animations. Otherwise, the animation frame is incremented to the next
// frame as specified by the animation spec.
// a frame is a texture

export default (entityId, componentState, context) => {
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
  const animationChanged = animChange && animChange !== currentAnimation;
  const renderEvents = [];

  let newSprites = sprites;
  let newFrame = frame;
  let newTickAccum = tickAccum;
  let newCurrentAnimation = currentAnimation;

  if (animationChanged) {
    newCurrentAnimation = animChange;
    newSprites = animation.children[nameMap[newCurrentAnimation]];

    // add a render event to the queue to turn off the current sprite
    pushToRenderEvents(renderEvents, () => {
      sprites.renderable = false;
    });
  }

  if (timeTick) {
    const fps = animationSpecs[newCurrentAnimation].fps;
    const tickThreshold = 1000 / fps;

    newTickAccum += timeTick.frameTime;

    if (newTickAccum > tickThreshold) {
      newTickAccum = 0;
      newFrame = setSpriteForRender(newSprites, newFrame, renderEvents);
    }
  }

  // if we had an update we want to make sure there was no frame
  // mutation somewhere in there by catching double frame cases and no
  // frame cases
  if (animationChanged || timeTick) {
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

  const newComponentState = {
    ...componentState,
    currentAnimation: newCurrentAnimation,
    tickAccum: newTickAccum,
    frame: newFrame,
  };

  if (renderEvents.length > 0) return [newComponentState, renderEvents];
  return newComponentState;
};
