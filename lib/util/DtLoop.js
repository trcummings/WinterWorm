// @flow

export opaque type Dt = number;
export const toDt = (
  timestamp: DOMHighResTimeStamp | number = 0,
  startTime: number = 0
): Dt => timestamp - startTime;
export const fromDt = (dt: Dt): number => dt;

class DtLoop {
  startTime: ? number = undefined;

  static start(update: Dt => mixed): number {
    const loop = new DtLoop();
    return loop.step(update)();
  }

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
