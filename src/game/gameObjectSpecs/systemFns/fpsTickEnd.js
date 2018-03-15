// @flow

// systems for rendering the fpsMeter
import { isDev } from 'Engine/util';

import type { GameState } from 'Types';

// Place at end of dev system list
export default (state: GameState): GameState => {
  // finish checking the fps meter frame rate
  if (isDev()) window.meter.tick();
  return state;
};
