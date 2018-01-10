// @flow
import { makeId } from '../util';
import { COMPONENTS, POSITION_CHANGE } from '../symbols';

import type { Component } from '../types';

export const setPositionState = ({ x, y, z }) => ({ x, y, z });

const updateOffset = (
  { offsetX: totalX, offsetY: totalY },
  { offsetX: xO, offsetY: yO }
) => ({ offsetX: totalX + xO, offsetY: totalY + yO });

const POSITION = 'position';

// Calculates the entities position on the map and on the screen. Listens
// for position changes in the format of [:position-change <entity-id>] with a
// message with keys for offsetX and offsetY
const position: Component = {
  label: POSITION,
  id: makeId(COMPONENTS),
  subscriptions: [POSITION_CHANGE],
  fn: (entityId, componentState, context = {}) => {
    const { inbox } = context;
    if (typeof inbox === 'undefined' || inbox.length === 0) return componentState;
    const { x, y, z } = componentState;
    const { offsetX, offsetY } = inbox.reduce(updateOffset, { offsetX: 0, offsetY: 0 });

    return setPositionState({ x: x - offsetX, y: y - offsetY, z });
  },
};

export { position };
