// @flow

// systems for rendering the fpsMeter
import { isDev } from 'Engine/util';

import type { GameState } from 'Types';

// Place at front of dev system list
export default (state: GameState): GameState => {
  // // start checking the fps meter frame rate
  if (isDev()) window.meter.tickStart();
  return state;
};
