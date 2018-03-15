// @flow
import { makeId } from '../util';
import { COMPONENTS } from '../symbols';

import type { Component } from '../types';

const FIXTURE = 'fixture';

const fixture: Component = {
  label: FIXTURE,
  id: makeId(COMPONENTS),
  fn: (entityId, componentState) => componentState,
};

export { fixture };
