// @flow

// System for handling changes to the game state
// e.g. adding/removing entities, changing scenes
import { getMetaEvents, clearMetaEvents } from 'Engine/events';
import { setState } from 'Engine/core';

import type { GameState, Spec } from 'Types';

// Processes all events on the meta queue (gameState.state.events.meta)
// and returns an updated game state. This is used for adding, removing
// entities or any other game state modifications
export default (state: GameState): GameState => {
  const events: Array<Spec> = getMetaEvents(state);

  if (!events || events.length === 0) return state;
  const next = events.reduce(setState, state);
  return clearMetaEvents(next);
};
