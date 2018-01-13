// @flow
// input.js: syscom for emitting events based on input
import { makeId } from '../util';
import { SYSTEMS } from '../symbols';
import { inputControllable } from '../components';

import type { System } from '../types';

const INPUT = 'input';

const inputControl: System = {
  label: INPUT,
  id: makeId(SYSTEMS),
  component: inputControllable,
};

export default inputControl;
