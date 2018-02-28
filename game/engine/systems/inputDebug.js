// @flow
// system for debugging keyboard input events
import { makeId } from '../util';
import { buttonPressDebug } from '../components';
import { SYSTEMS } from '../symbols';

import type { System } from '../types';

const INPUT_DEBUG = 'inputDebug';

const inputDebug: System = {
  label: INPUT_DEBUG,
  id: makeId(SYSTEMS),
  component: buttonPressDebug,
};

export default inputDebug;
