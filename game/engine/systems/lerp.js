// @flow
import { makeId } from '../util';

import type { GameState, System } from '../types';

const lerp: System = {
  id: makeId(),
  fn: (state: GameState): GameState => state,
  component: () => {},
};

export default lerp;
