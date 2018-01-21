// @flow
import { makeId } from '../util';
import { COMPONENTS, POSITION_CHANGE } from '../symbols';
import { getInboxEvents } from '../events';

import type { Component } from '../types';

export const makePositionState = ({ x, y, z }) => ({ x, y, z });
const INITIAL_OFFSET = { offsetX: 0, offsetY: 0 };

const updateOffset = (
  { offsetX: totalX, offsetY: totalY },
  { action: { offsetX: xO, offsetY: yO } }
) => ({ offsetX: totalX + xO, offsetY: totalY + yO });

const POSITIONABLE = 'positionable';

// Calculates the entities position on the map and on the screen. Listens
// for position changes in the format of [:position-change <entity-id>] with a
// message with keys for offsetX and offsetY
const positionable: Component = {
  label: POSITIONABLE,
  id: makeId(COMPONENTS),
  subscriptions: [POSITION_CHANGE],
  fn: (entityId, componentState, context = {}) => {
    const events = getInboxEvents(POSITION_CHANGE)(context.inbox);

    if (events.length === 0) return componentState;

    const { x, y, z } = componentState;
    const { offsetX, offsetY } = events.reduce(updateOffset, INITIAL_OFFSET);

    return makePositionState({ x: x + offsetX, y: y - offsetY, z });
  },
};

export { positionable };
