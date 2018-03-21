import { filters } from 'pixi.js';
import { PIXI_INTERACTION, RENDER_ACTION } from 'Engine/symbols';
import { hasEventInInbox, makeEvent } from 'Engine/events';

import {
  POINTER_UP,
  POINTER_DOWN,
  POINTER_UP_OUTSIDE,
  POINTER_OVER,
  POINTER_MOVE,
  POINTER_OUT,
} from 'Game/gameObjectSpecs/componentStateFns/interactable';

// const PIXI_INTERACTION = 'pixiInteraction';

// const pushToRenderEvents = entityId => (renderEvents, fn) => {
//   renderEvents.push(makeEvent(fn, [RENDER_ACTION, entityId]));
// };

const getInteraction = hasEventInInbox(PIXI_INTERACTION);

// // blue
// const makeSelectedOutline = () => (
//   new filters.OutlineFilter(2, 0x99ff99)
// );
//
// // red
// const makeDraggingOutline = () => (
//   new filters.OutlineFilter(2, 0xff9999)
// );


export default (entityId, componentState, context) => {
  const { inbox } = context;
  // const { nameMap, animation, currentAnimation, currentFrame } = componentState;
  const renderEvents = [];

  // if no interactions have happened, do nothing
  const interaction = getInteraction(inbox);
  if (!interaction) return componentState;

  console.log(componentState);

  switch (interaction) {
    // add a nice filter over the entity to say "hey, you could select
    // this, if you wanted to. no presh."
    case POINTER_OVER: {
      break;
    }

    // if its not selected, select this entity
    // on top of that, set dragging to be true
    case POINTER_DOWN: {
      break;
    }

    // set dragging to false, but keep the entity selected
    case POINTER_UP:
    case POINTER_UP_OUTSIDE: {
      break;
    }

    // if dragging is true, set the event data here to be used by the
    // interaction system further down the line
    case POINTER_MOVE: {
      break;
    }

    // if they were highlighted, we can remove the highlighting (unless
    // they're still selected)
    case POINTER_OUT: {
      break;
    }

    default: break;
  }

  // pushToRenderEvents(renderEvents, () => {
  //
  // });

  return [componentState, renderEvents];
};
