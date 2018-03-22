// @flow
import { PIXI_INTERACTION } from 'Game/engine/symbols';
import { emitEventsToQueue, makeEvent, emitEvent, getEventsOfOnlyEventId } from 'Game/engine/events';
import { getSubscribedEntityIds } from 'Game/engine/ecs';

import {
  POINTER_UP,
  POINTER_DOWN,
  POINTER_UP_OUTSIDE,
  POINTER_OVER,
  POINTER_MOVE,
  POINTER_OUT,
  SELECT_ENTITY,
} from 'Game/gameObjectSpecs/componentStateFns/interactable';

import type { GameState } from 'Types';

const entities = {};

export const addInteraction = (state, entityId, sprite) => {
  sprite.buttonMode = true; // eslint-disable-line
  sprite.interactive = true; // eslint-disable-line
  entities[entityId] = [];

  const setEventOnEntity = eventType => (event) => {
    // if we dont have an empty event queue for this entity, initialize it
    if (!entities[entityId]) entities[entityId] = [];
    entities[entityId].push([eventType, event.data]);
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
  total.concat(interactions[eId].map(payload => makeEvent(payload, [PIXI_INTERACTION, eId])))
);

const computeEditorInteractions = (state: GameState) => {
  const interactionEvents = getEventsOfOnlyEventId(state, PIXI_INTERACTION);
  return interactionEvents.length > 0
    ? getSubscribedEntityIds(state, PIXI_INTERACTION)
      .reduce((total, eId) => (
        interactionEvents.reduce((next, { action: entityId }) => (
          emitEvent(next, [SELECT_ENTITY, entityId], [PIXI_INTERACTION, eId])
        ), total)
      ), state)
    : state;
};

const computeComponentInteractions = (state: GameState) => {
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

export default (state: GameState): GameState => (
  computeComponentInteractions(computeEditorInteractions(state))
);
