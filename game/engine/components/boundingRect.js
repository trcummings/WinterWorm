// @flow
import { makeId } from '../util';
import { COMPONENTS } from '../symbols';

import type { Component } from '../types';

const BOUNDING_RECT = 'boundingRect';

const boundingRect: Component = {
  label: BOUNDING_RECT,
  id: makeId(COMPONENTS),
  fn: (_, componentState) => componentState,
};

export { boundingRect };
