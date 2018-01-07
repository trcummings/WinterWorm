// @flow
import { makeId } from '../util';
import { buttonPressDebug } from '../components';
import { SYSTEMS } from '../symbols';

import type { System } from '../types';

const inputDebug: System = {
  id: makeId(SYSTEMS),
  component: buttonPressDebug,
};

export default inputDebug;
