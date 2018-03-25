// @flow
import { getEventsOfEventId } from 'Game/engine/events';
import { REMOVE_ENTITY } from 'Game/engine/symbols';
import { removeEntity } from 'Game/engine/ecs';

import type { GameState } from 'Types';

export default (state: GameState): GameState => {
  const events = getEventsOfEventId(state, REMOVE_ENTITY);
  return events.reduce((next, { action }) => removeEntity(next, action), state);
};
