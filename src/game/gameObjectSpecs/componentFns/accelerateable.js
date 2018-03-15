// @flow
import { ACCELERATION_CHANGE } from 'Engine/symbols';
import { getInboxEvents } from 'Engine/events';

export const makeAccelState = ({ ax, ay }) => ({ ax, ay });

export default (entityId, componentState, context = {}) => {
  const events = getInboxEvents(ACCELERATION_CHANGE)(context.inbox);

  if (events.length === 0) return componentState;

  const { ax, ay } = componentState;
  const { ax: ax_ = ax, ay: ay_ = ay } = events[events.length - 1].action;

  if (ax === ax_ && ay === ay_) return componentState;
  return Object.assign({}, { ax, ay }, { ax: ax_, ay: ay_ });
};
