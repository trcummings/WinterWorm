import { SELECT_INSPECTOR_ENTITY, DRAG_ENTITY } from 'App/actionTypes';
import { PIXI_INTERACTION, GAME_TO_EDITOR, POSITION_CHANGE } from 'Engine/symbols';
import { makeEvent, getInboxEvents } from 'Engine/events';
import { posToUnitPos } from 'Game/engine/pixi';

import {
  POINTER_UP,
  POINTER_DOWN,
  POINTER_UP_OUTSIDE,
  POINTER_OVER,
  POINTER_MOVE,
  POINTER_OUT,
  SELECT_ENTITY,
} from 'Game/gameObjectSpecs/componentStateFns/interactable';

const getInteractions = getInboxEvents(PIXI_INTERACTION);

const getPos = (animation, event) => (
  posToUnitPos(event.data.getLocalPosition(animation))
);

const computeInteractableState = (entityId, context) => (total, interaction) => {
  const [componentState, events] = total;
  const {
    displayContainerable: { displayContainer: animation },
    positionable: pos,
  } = context;
  const { over, touching, data, selected } = componentState;

  const [eventType, event] = interaction;

  switch (eventType) {
    // add a nice filter over the entity to say "hey, you could select
    // this, if you wanted to. no presh."
    case POINTER_OVER: return [{ ...componentState, over: true }, events];

    // case where we click the entity while over it
    case POINTER_DOWN: {
      if (!over) return [componentState, events];
      // if we are over the sprite and we click it,
      // start touching, & give initial position data to the state
      const { x, y } = getPos(animation, event);
      const action = [SELECT_INSPECTOR_ENTITY, entityId];

      // if we are selected already when we click, we dont need to
      // signal to the editor to select this entity
      const newEvents = selected
        ? events
        : [...events, makeEvent(action, [GAME_TO_EDITOR])];

      return [{ ...componentState, touching: true, data: { x, y } }, newEvents];
    }

    // case where we release the entity after dragging
    case POINTER_UP:
    case POINTER_UP_OUTSIDE: {
      // if we are not dragging it, ignore these events
      if (!touching || !selected) return [componentState, events];

      // signal to the editor that we have changed the entitys position
      return [
        { ...componentState, data: null, touching: false },
        [...events, makeEvent([DRAG_ENTITY, pos], [GAME_TO_EDITOR])],
      ];
    }

    // case where the entity is selected, we are dragging the entity,
    // & we are updating its position with each cycle
    case POINTER_MOVE: {
      if (!selected || !over || !touching) return [componentState, events];

      const { x: currentX, y: currentY } = getPos(animation, event);

      if (!data) {
        return [
          { ...componentState, data: { x: currentX, y: currentY } },
          events,
        ];
      }

      // if we are over, touching, and we have past data, do some draggin
      const { x: pastX, y: pastY } = data;
      const x = currentX - pastX;
      const y = currentY - pastY;
      const action = { offsetX: x, offsetY: -y };

      return [
        { ...componentState, data: { x: pastX, y: pastY } },
        [...events, makeEvent(action, [POSITION_CHANGE, entityId])],
      ];
    }

    // case where we are not touching the entity, and we drag the pointer
    // out from it
    case POINTER_OUT: return touching
      ? [componentState, events]
      : [{ ...componentState, over: false, data: null }, events];

    // if we receive a select entity event that isnt null
    // set whether or not we are selected based on if the id dispatched
    // is our id or not
    case SELECT_ENTITY: {
      return [{ ...componentState, selected: event === entityId }, events];
    }

    default: return [componentState, events];
  }
};

// we want to only take the latest pointer move event
const filterDownPointerMoves = (inbox) => {
  const interactions = getInteractions(inbox);
  let hasPointerMove = false;

  return interactions
    .reduceRight((total, event) => {
      const { action } = event;
      const isPointerMove = action[0] === POINTER_MOVE;
      if (!action || (isPointerMove && hasPointerMove)) return total;
      if (isPointerMove) hasPointerMove = true;

      return [action].concat(total);
    }, []);
};

export default (entityId, componentState, context) => {
  const { inbox } = context;
  const interactions = filterDownPointerMoves(inbox);

  // compute state over each interaction
  const computeInteraction = computeInteractableState(entityId, context);

  return interactions.reduce(computeInteraction, [componentState, []]);
};
