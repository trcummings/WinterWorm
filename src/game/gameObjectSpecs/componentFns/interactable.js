import { filters } from 'pixi.js';
import { SELECT_INSPECTOR_ENTITY, DRAG_ENTITY } from 'App/actionTypes';
import { PIXI_INTERACTION, RENDER_ACTION, GAME_TO_EDITOR, POSITION_CHANGE } from 'Engine/symbols';
import { hasEventInInbox, makeEvent } from 'Engine/events';

import {
  POINTER_UP,
  POINTER_DOWN,
  POINTER_UP_OUTSIDE,
  POINTER_OVER,
  POINTER_MOVE,
  POINTER_OUT,
} from 'Game/gameObjectSpecs/componentStateFns/interactable';

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

// on mouse move
// var newPosition = this.data.getLocalPosition(this.parent);
//         this.x = newPosition.x;
//         this.y = newPosition.y;

export default (entityId, componentState, context) => {
  const { inbox, spriteRenderable: { animation }, positionable: pos } = context;
  const { data, over, touching } = componentState;
  const events = [];

  let newData = data;
  let newOver = over;
  let newTouching = touching;

  // if no interactions have happened, do nothing
  const interaction = getInteraction(inbox);
  if (!interaction) return componentState;

  const [eventType, iData] = interaction;

  switch (eventType) {
    // add a nice filter over the entity to say "hey, you could select
    // this, if you wanted to. no presh."
    case POINTER_OVER: {
      newOver = true;
      // set filter
      break;
    }

    // if its not selected, select this entity
    // on top of that, set dragging to be true
    case POINTER_DOWN: {
      if (over) {
        newTouching = true;
        const { x, y } = iData.getLocalPosition(animation);
        newData = { x, y };


        const action = [SELECT_INSPECTOR_ENTITY, entityId];
        events.push(makeEvent(action, [GAME_TO_EDITOR]));
      }
      break;
    }

    // set dragging to false, but keep the entity selected
    case POINTER_UP:
    case POINTER_UP_OUTSIDE: {
      if (touching) {
        const action = [DRAG_ENTITY, pos];
        events.push(makeEvent(action, [GAME_TO_EDITOR]));
      }

      newData = null;
      newTouching = false;
      break;
    }

    // if dragging is true, set the event data here to be used by the
    // interaction system further down the line
    case POINTER_MOVE: {
      const { x: currentX, y: currentY } = iData.getLocalPosition(animation);

      if (over && touching && data) {
        const { x: pastX, y: pastY } = data;

        const x = currentX - pastX;
        const y = currentY - pastY;

        const action = {
          offsetX: Math.floor(x),
          offsetY: -Math.floor(y),
        };

        // animation.pivot.set(currentX, currentY);
        newData = { x: pastX, y: pastY };


        events.push(makeEvent(action, [POSITION_CHANGE, entityId]));
      }
      else newData = { x: currentX, y: currentY };


      break;
    }

    // if they were highlighted, we can remove the highlighting (unless
    // they're still selected)
    case POINTER_OUT: {
      newOver = false;
      newTouching = false;
      newData = null;
      break;
    }

    default: break;
  }

  return [{
    ...componentState,
    touching: newTouching,
    over: newOver,
    data: newData,
  }, events];
};
