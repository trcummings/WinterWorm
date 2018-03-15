// @flow
import { assocPath } from 'ramda';

import { STATE, QUEUE, META, EVENTS } from '../symbols';

import type { Script, GameState } from '../types';

const events = {
  [QUEUE]: [],
  [META]: [],
};

const initEvents: Script = (state: GameState) => (
  assocPath([STATE, EVENTS], events, state)
);

export default initEvents;
