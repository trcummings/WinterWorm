// @flow

// System for handling changes to the game state
// e.g. adding/removing entities, changing scenes
import { getMetaEvents, clearMetaEvents } from '../events';
import { setState } from '../core';
import { makeId } from '../util';
import { SYSTEMS } from '../symbols';
import type { System, GameState, Spec } from '../types';

const META = 'meta';
// Processes all events on the meta queue (gameState.state.events.queue.meta)
// and returns an updated game state. This is used for adding, removing
// entities or any other game state modifications
const meta: System = {
  label: META,
  id: makeId(SYSTEMS),
  fn: (state: GameState): GameState => {
    const events: Array<Spec> = getMetaEvents(state);

    if (!events || events.length === 0) return state;
    const next = events.reduce(setState, state);
    return clearMetaEvents(next);
  },
};

export default meta;
