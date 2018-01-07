// @flow
import { makeId } from '../util';
import { COMPONENTS, KEYBOARD_INPUT } from '../symbols';

import type { Component } from '../types';

const buttonPressDebug: Component = {
  id: makeId(COMPONENTS),
  subscriptions: [KEYBOARD_INPUT],
  fn: (entityId, componentState, context) => componentState,
};

export { buttonPressDebug };
