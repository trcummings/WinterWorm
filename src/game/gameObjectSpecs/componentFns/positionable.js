import { POSITION_CHANGE } from 'Engine/symbols';
import { getInboxEvents } from 'Engine/events';

const INITIAL_OFFSET = { offsetX: 0, offsetY: 0 };

const updateOffset = (
  { offsetX: totalX, offsetY: totalY },
  { action: { offsetX: xO, offsetY: yO } }
) => ({ offsetX: totalX + xO, offsetY: totalY + yO });

export default (entityId, componentState, context = {}) => {
  const events = getInboxEvents(POSITION_CHANGE)(context.inbox);

  if (events.length === 0) return componentState;

  const { x, y } = componentState;
  const { offsetX, offsetY } = events.reduce(updateOffset, INITIAL_OFFSET);

  return [{ x: x + offsetX, y: y - offsetY }];
};
