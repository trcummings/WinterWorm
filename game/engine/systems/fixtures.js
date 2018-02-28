// @flow
import { makeId } from '../util';
import { fixture } from '../components';
import { SYSTEMS } from '../symbols';

import type { System } from '../types';

const FIXTURES = 'fixtures';

const fixtures: System = {
  label: FIXTURES,
  id: makeId(SYSTEMS),
  component: fixture,
};

export default fixtures;
