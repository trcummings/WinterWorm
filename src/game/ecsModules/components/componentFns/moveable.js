import { TIME_TICK, POSITION_CHANGE } from 'Engine/symbols';
import { hasEventInInbox, makeEvent } from 'Engine/events';

export const makeVelocityState = ({ vx, vy }) => ({ vx, vy });

const calcVel = (v, a, t) => v + (a * t);
const calcPos = (v, a, t) => (v * t) + ((1 / 2) * a * Math.pow(t, 2));

export default (entityId, componentState, context = {}) => {
  const { accelerateble: { ax, ay }, inbox } = context;
  const { vy, vx } = componentState;
  const timeTick = hasEventInInbox(TIME_TICK)(inbox);
  const t = (timeTick.frameTime / 1000);

  const vx1 = calcVel(vx, ax, t);
  const vy1 = calcVel(vy, ay, t);
  const x1 = calcPos(vx, ax, t);
  const y1 = calcPos(vy, ay, t);

  return [
    { ...componentState, vx: vx1, vy: vy1 },
    makeEvent({ offsetY: y1, offsetX: x1 }, [POSITION_CHANGE, entityId]),
  ];
};
