// // @flow
import { makeId } from '../util';
import { COMPONENTS, TIME_TICK, POSITION_CHANGE } from '../symbols';
// import { positionable } from './positionable';
import { accelerable } from './accelerable';
import { hasEventInInbox, makeEvent } from '../events';

import type { Component } from '../types';

export const makeVelocityState = ({ vx, vy }) => ({ vx, vy });

const MOVEABLE = 'moveable';

const moveable: Component = {
  label: MOVEABLE,
  id: makeId(COMPONENTS),
  subscriptions: [TIME_TICK],
  context: [accelerable.id],
  fn: (entityId, componentState, context = {}) => {
    const {
      [accelerable.id]: { ay },
      inbox,
    } = context;
    const { vy } = componentState;
    const timeTick = hasEventInInbox(TIME_TICK)(inbox);
    const t = (timeTick.frameTime / 1000);
    const newVy = vy + (ay * t);
    const newY = (vy * t) + ((1 / 2) * (ay) * Math.pow(t, 2));
    const event = makeEvent({ offsetY: newY, offsetX: 0 }, [POSITION_CHANGE, entityId]);

    return [{ ...componentState, vy: newVy }, [event]];
  },
};

export { moveable };
