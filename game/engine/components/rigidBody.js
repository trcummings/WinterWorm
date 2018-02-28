// @flow
import { makeId } from '../util';
import { COMPONENTS } from '../symbols';

import type { Component } from '../types';

const RIGID_BODY = 'rigidBody';

const rigidBody: Component = {
  id: makeId(COMPONENTS),
  label: RIGID_BODY,
  // subscriptions: [],
  // context: [],
  fn: (entityId, componentState, context) => componentState,
};

export { rigidBody };
