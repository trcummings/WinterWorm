import { POSITION_CHANGE } from '../symbols';
import { getInboxEvents } from '../events';

const INITIAL_OFFSET = { offsetX: 0, offsetY: 0 };

const updateOffset = (
  { offsetX: totalX, offsetY: totalY },
  { action: { offsetX: xO, offsetY: yO } }
) => ({ offsetX: totalX + xO, offsetY: totalY + yO });

export default (entityId, componentState, context = {}) => {
  const events = getInboxEvents(POSITION_CHANGE)(context.inbox);

  if (events.length === 0) return componentState;

  const { x, y, z } = componentState;
  const { offsetX, offsetY } = events.reduce(updateOffset, INITIAL_OFFSET);

  return [{ x: x + offsetX, y: y - offsetY, z }];
};
