// @flow

// Dt
export opaque type Dt: number = number;

export const toDt = (
  timestamp: DOMHighResTimeStamp | number = 0,
  startTime: number = 0
): Dt => timestamp - startTime;


// WindowConfig
// type WindowConfig = {
//   width: number,
//   height: number,
//   frame: boolean,
//   transparent: boolean,
// };
