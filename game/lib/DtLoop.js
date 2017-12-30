// @flow

import type { Dt } from './types';
import { toDt } from './types';

class DtLoop {
  static start(update: Dt => mixed): number {
    const loop = new DtLoop();
    return loop.step(update)();
  }

  startTime = undefined;

  getDtFromTimeStamp = (timestamp?: DOMHighResTimeStamp): Dt => {
    if (!this.startTime) this.startTime = timestamp;
    return toDt(timestamp, this.startTime);
  }

  step = (update: Dt => mixed) => (timestamp?: DOMHighResTimeStamp): number => {
    const dt = this.getDtFromTimeStamp(timestamp);
    update(dt);
    return window.requestAnimationFrame(this.step(update));
  }
}

export default DtLoop;
