// @flow
// system for clearing out the event queue at the end of the system fn
import { makeId } from '../util';
// import { SYSTEMS, ENTITY_TRASHCAN } from '../symbols';
import { SYSTEMS } from '../symbols';

import type { System, GameState } from '../types';

const TRASHCAN = 'trashcan';

const trashcan: System = {
  label: TRASHCAN,
  id: makeId(SYSTEMS),
  fn: (state: GameState) => state,
};

export default trashcan;
