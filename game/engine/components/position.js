// @flow
import { makeId } from '../util';
import { COMPONENTS } from '../symbols';

import type { Component } from '../types';

export const POSITION_CHANGE = 'positionChange';
export const setPositionState = ({ x, y, z }) => ({ x, y, z });

const updateOffset = (
  { offsetX: totalX, offsetY: totalY },
  { offsetX: xO, offsetY: yO }
) => ({ offsetX: totalX + xO, offsetY: totalY + yO });
// Calculates the entities position on the map and on the screen. Listens
// for position changes in the format of [:position-change <entity-id>] with a
// message with keys for offsetX and offsetY
const position: Component = {
  id: makeId(COMPONENTS),
  subscriptions: [POSITION_CHANGE],
  fn: (entityId, componentState, context) => {
    const { inbox } = context;
    if (inbox.length === 0) return componentState;
    const { x, y, z } = componentState;
    const { offsetX, offsetY } = inbox.reduce(updateOffset, { offsetX: 0, offsetY: 0 });

    return setPositionState({ x: x - offsetX, y: y - offsetY, z });
  },
};

export { position };
