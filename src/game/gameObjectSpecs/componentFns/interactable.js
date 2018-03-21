import { filters } from 'pixi.js';
import { PIXI_INTERACTION, RENDER_ACTION, GAME_TO_EDITOR } from 'Engine/symbols';
import { hasEventInInbox, makeEvent } from 'Engine/events';

import {
  POINTER_UP,
  POINTER_DOWN,
  POINTER_UP_OUTSIDE,
  POINTER_OVER,
  POINTER_MOVE,
  POINTER_OUT,
} from 'Game/gameObjectSpecs/componentStateFns/interactable';

const SELECT_INSPECTOR_ENTITY = 'selectInspectorEntity!';
const DRAG_ENTITY = 'dragEntity!';

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
  const { inbox, spriteRenderable: { animation } } = context;
  const { over, touching } = componentState;
  const renderEvents = [];
  const editorEvents = [];
  const pushToEditorEvents = (action) => {
    editorEvents.push(makeEvent(action, [GAME_TO_EDITOR]));
  };
  let newOver = over;
  let newTouching = touching;

  // if no interactions have happened, do nothing
  const interaction = getInteraction(inbox);
  if (!interaction) return componentState;

  const [eventType, data] = interaction;

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
        pushToEditorEvents([SELECT_INSPECTOR_ENTITY, entityId]);
        newTouching = true;
      }
      break;
    }

    // set dragging to false, but keep the entity selected
    case POINTER_UP:
    case POINTER_UP_OUTSIDE: {
      newOver = false;
      break;
    }

    // if dragging is true, set the event data here to be used by the
    // interaction system further down the line
    case POINTER_MOVE: {
      // if (touching) {
      //   const pos = data.getLocalPosition(animation);
      //   pushToEditorEvents([DRAG_ENTITY, pos]);
      // }
      break;
    }

    // if they were highlighted, we can remove the highlighting (unless
    // they're still selected)
    case POINTER_OUT: {
      newOver = false;
      break;
    }

    default: break;
  }

  // pushToRenderEvents(renderEvents, () => {
  //
  // });

  const allEvents = [...renderEvents, ...editorEvents];

  return [{
    ...componentState,
    touching: newTouching,
    over: newOver,
  }, allEvents];
};
