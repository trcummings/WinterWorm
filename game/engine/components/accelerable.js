// @flow
import { makeId } from '../util';
import { COMPONENTS, ACCELERATION_CHANGE } from '../symbols';
import { getInboxEvents } from '../events';

import type { Component } from '../types';

export const makeAccelState = ({ ax, ay }) => ({ ax, ay });

const ACCELERABLE = 'accelerable';

const accelerable: Component = {
  label: ACCELERABLE,
  id: makeId(COMPONENTS),
  subscriptions: [ACCELERATION_CHANGE],
  fn: (entityId, componentState, context = {}) => {
    const events = getInboxEvents(ACCELERATION_CHANGE, context.inbox);

    if (events.length === 0) return componentState;

    const { ax, ay } = componentState;
    const { ax: ax_, ay: ay_ } = events[events.length - 1];

    if (ax === ax_ && ay === ay_) return componentState;
    return Object.assign({}, { ax, ay }, { ax_, ay_ });
  },
};

export { accelerable };
