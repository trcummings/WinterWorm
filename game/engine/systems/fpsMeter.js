// @flow

// systems for rendering the fpsMeter
import { makeId, isDev } from '../util';
import { SYSTEMS } from '../symbols';

import type { System, GameState } from '../types';

const FPS_TICK_START = 'fpsTickStart';
const FPS_TICK_END = 'fpsTickEnd';

// Place at front of dev system list
export const fpsTickStart: System = {
  label: FPS_TICK_START,
  id: makeId(SYSTEMS),
  fn: (state: GameState): GameState => {
    // // start checking the fps meter frame rate
    if (isDev()) window.meter.tickStart();
    return state;
  },
};

// Place at end of dev system list
export const fpsTickEnd: System = {
  label: FPS_TICK_END,
  id: makeId(SYSTEMS),
  fn: (state: GameState): GameState => {
    // finish checking the fps meter frame rate
    if (isDev()) window.meter.tick();
    return state;
  },
};
