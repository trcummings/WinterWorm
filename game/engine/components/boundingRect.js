// @flow
import { makeId } from '../util';
import { COMPONENTS } from '../symbols';

import type { Component } from '../types';

const boundingRect: Component = {
  id: makeId(COMPONENTS),
  fn: (_, componentState) => componentState,
};

export { boundingRect };
