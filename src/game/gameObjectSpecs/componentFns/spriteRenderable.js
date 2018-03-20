import { ANIMATION_CHANGE, RENDER_ACTION } from 'Engine/symbols';
import { hasEventInInbox, makeEvent } from 'Engine/events';

const pushToRenderEvents = (renderEvents, fn) => {
  renderEvents.push(makeEvent(fn, [RENDER_ACTION]));
};

const getAnimChange = hasEventInInbox(ANIMATION_CHANGE);

// When an action event is in the inbox, it changes the state and switches
// animations. Otherwise, the animation frame is incremented to the next
// frame as specified by the animation spec.
// a frame is a texture

export default (entityId, componentState, context) => {
  const { inbox } = context;
  const { nameMap, animation, currentFrame } = componentState;

  const animChange = getAnimChange(inbox);
  const animIndex = nameMap[currentFrame];
  const sprites = animation.children[animIndex];
  const animationChanged = animChange && animChange !== currentFrame;
  const renderEvents = [];

  let newSprites = sprites;
  let newCurrentFrame = currentFrame;

  if (animationChanged) {
    newCurrentFrame = animChange;
    newSprites = animation.children[nameMap[newCurrentFrame]];

    // add a render event to the queue to turn off the current sprite
    pushToRenderEvents(renderEvents, () => {
      sprites.renderable = false;
    });
  }

  // if we had an update we want to make sure there was no frame
  // mutation somewhere in there by catching double frame cases and no
  // frame cases
  if (animationChanged) {
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
    currentFrame: newCurrentFrame,
  };

  const { positionable: { x, y } = {} } = context;
  animation.setTransform(x, y);

  if (renderEvents.length > 0) return [newComponentState, renderEvents];
  return newComponentState;
};
