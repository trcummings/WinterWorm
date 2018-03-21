// @flow
import { PIXI_INTERACTION } from 'Engine/symbols';
import { emitEventsToQueue, makeEvent } from 'Engine/events';

import {
  POINTER_UP,
  POINTER_DOWN,
  POINTER_UP_OUTSIDE,
  POINTER_OVER,
  POINTER_MOVE,
  POINTER_OUT,
} from 'Game/gameObjectSpecs/componentStateFns/interactable';

import type { GameState } from 'Types';

const entities = {};

export const addInteraction = (state, entityId, sprite) => {
  sprite.buttonMode = true; // eslint-disable-line
  sprite.interactive = true; // eslint-disable-line
  entities[entityId] = null;

  const setEventOnEntity = eventType => (event) => {
    // pointer over events & pointer move events happen near simultaneously
    // in order to capture the pointer over event (which is more important),
    // supercede adding pointer move
    if (entities[entityId]) {
      const [lastEvent] = entities[entityId];
      if (lastEvent === POINTER_OVER && eventType === POINTER_MOVE) return;
    }

    entities[entityId] = [eventType, event.data];
  };

  sprite
    .on(POINTER_UP, setEventOnEntity(POINTER_UP))
    .on(POINTER_DOWN, setEventOnEntity(POINTER_DOWN))
    .on(POINTER_UP_OUTSIDE, setEventOnEntity(POINTER_UP_OUTSIDE))
    .on(POINTER_OVER, setEventOnEntity(POINTER_OVER))
    .on(POINTER_OUT, setEventOnEntity(POINTER_OUT))
    .on(POINTER_MOVE, setEventOnEntity(POINTER_MOVE));

  return state;
};

const addInteractionEvent = interactions => (total, eId) => (
  interactions[eId]
    ? total.concat(makeEvent(interactions[eId], [PIXI_INTERACTION, eId]))
    : total
);

export default (state: GameState): GameState => {
  // capture mutable input object right NOW by making a shallow copy
  const interactions = Object.assign({}, entities);

  // clear the object
  Object.keys(entities).forEach(eId => (delete entities[eId]));

  // build up the events from the copy
  const events = Object.keys(interactions)
    .reduce(addInteractionEvent(interactions), []);

  if (events.length > 0) return emitEventsToQueue(state, events);
  return state;
};
