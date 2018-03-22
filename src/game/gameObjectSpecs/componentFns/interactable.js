import { OutlineFilter } from '@pixi/filter-outline';

import { SELECT_INSPECTOR_ENTITY, DRAG_ENTITY } from 'App/actionTypes';
import { PIXI_INTERACTION, RENDER_ACTION, GAME_TO_EDITOR, POSITION_CHANGE } from 'Engine/symbols';
import { makeEvent, getInboxEvents } from 'Engine/events';

import {
  POINTER_UP,
  POINTER_DOWN,
  POINTER_UP_OUTSIDE,
  POINTER_OVER,
  POINTER_MOVE,
  POINTER_OUT,
  SELECT_ENTITY,
} from 'Game/gameObjectSpecs/componentStateFns/interactable';

import { getCurrentSprite } from './spriteRenderable';


const getInteractions = getInboxEvents(PIXI_INTERACTION);

const BLUE = 0x87CEFA;
const GREEN = 0x99ff99;
const RED = 0xff9999;

const makeColorFilter = color => new OutlineFilter(2, color);

const redFilter = makeColorFilter(RED);
const greenFilter = makeColorFilter(GREEN);
const blueFilter = makeColorFilter(BLUE);

const computeInteractableState = (entityId, context) => ([cState, events], interaction) => {
  const { spriteRenderable: { animation }, positionable: pos } = context;

  const [eventType, iData] = interaction;

  switch (eventType) {
    // add a nice filter over the entity to say "hey, you could select
    // this, if you wanted to. no presh."
    case POINTER_OVER: return [{ ...cState, over: true }, events];

    // case where we click the entity while over it
    case POINTER_DOWN: {
      if (!cState.over) return [cState, events];
      // if we are over the sprite and we click it,
      // start touching, & give initial position data to the state
      const { x, y } = iData.getLocalPosition(animation);
      const action = [SELECT_INSPECTOR_ENTITY, entityId];

      // if we are selected already when we click, we dont need to
      // signal to the editor to select this entity
      const newEvents = cState.selected
        ? events
        : [...events, makeEvent(action, [GAME_TO_EDITOR])];

      return [{ ...cState, touching: true, data: { x, y } }, newEvents];
    }

    // case where we release the entity after dragging
    case POINTER_UP:
    case POINTER_UP_OUTSIDE: {
      // if we are not dragging it, ignore these events
      if (!cState.touching) return [cState, events];

      // signal to the editor that we have changed the entitys position
      return [{
        ...cState,
        data: null,
        touching: false,
      }, [...events, makeEvent([DRAG_ENTITY, pos], [GAME_TO_EDITOR])]];
    }

    // case where the entity is selected, we are dragging the entity,
    // & we are updating its position with each cycle
    case POINTER_MOVE: {
      if (!cState.selected) return [cState, events];

      const { x: currentX, y: currentY } = iData.getLocalPosition(animation);

      // if we are over, touching, and we have past data, do some draggin
      if (cState.over && cState.touching && cState.data) {
        const { x: pastX, y: pastY } = cState.data;

        const x = currentX - pastX;
        const y = currentY - pastY;

        const action = { offsetX: Math.floor(x), offsetY: -Math.floor(y) };

        return [{
          ...cState,
          data: { x: pastX, y: pastY },
        }, [...events, makeEvent(action, [POSITION_CHANGE, entityId])]];
      }

      return [{ ...cState, data: { x: currentX, y: currentY } }, events];
    }

    // case where we are not touching the entity, and we drag the POINTER_UP
    // out from it
    case POINTER_OUT: return cState.touching
      ? [cState, events]
      : [{ ...cState, over: false, data: null }, events];

    // if we receive a select entity event that isnt null
    // set whether or not we are selected based on if the id dispatched
    // is our id or not
    case SELECT_ENTITY: {
      return [{ ...cState, selected: iData === entityId }, events];
    }

    default: return [cState, events];
  }
};

const applyFilters = spriteRenderable => ([componentState, events]) => {
  const sprite = getCurrentSprite(spriteRenderable);
  const { touching, over, selected } = componentState;
  let filterEvent;

  if (over && !touching) {
    filterEvent = () => {
      sprite.filters = [blueFilter];
    };
  }
  else if (touching) {
    filterEvent = () => {
      sprite.filters = [greenFilter];
    };
  }
  else if (!over && !touching && selected) {
    filterEvent = () => {
      sprite.filters = [redFilter];
    };
  }
  else {
    filterEvent = () => {
      sprite.filters = null;
    };
  }

  return [componentState, [...events, makeEvent(filterEvent, [RENDER_ACTION])]];
};

export default (entityId, componentState, context) => {
  const { inbox, spriteRenderable } = context;

  const interactions = getInteractions(inbox).map(({ action }) => action);

  // compute state over each interaction
  const computeInteraction = computeInteractableState(entityId, context);
  const setFilters = applyFilters(spriteRenderable);

  return setFilters(
    interactions.reduce(computeInteraction, [componentState, []])
  );
};
