// @flow
import { POSITION_CHANGE } from 'Game/engine/symbols';
import { getInboxEvents } from 'Game/engine/events';
import { pixelsToUnits } from 'Game/engine/pixi';

import { type EntityId } from 'Editor/types';
import { type PositionableState } from 'Editor/inspector/entityInspector/views/Positionable';

const INITIAL_OFFSET = {
  offsetX: pixelsToUnits(0),
  offsetY: pixelsToUnits(0),
};

const updateOffset = (
  { offsetX: totalX, offsetY: totalY },
  { action: { offsetX: xO, offsetY: yO } }
) => ({ offsetX: totalX + xO, offsetY: totalY + yO });

export default (entityId: EntityId, componentState: PositionableState, context = {}) => {
  const events = getInboxEvents(POSITION_CHANGE)(context.inbox);

  if (events.length === 0) return componentState;

  const { x, y } = componentState;
  const { offsetX, offsetY } = events.reduce(updateOffset, INITIAL_OFFSET);

  return [{ x: x + offsetX, y: y - offsetY }];
};
