import { view, over } from 'ramda';

import { conjoin } from './util';

export const getEvents = (state, selectors) => view(selectors, state);
export const makeEvent = (action, selectors) => ({ selectors, action });
export const emitEvent = (state, action, selectors) => (event => (
  over(selectors, conjoin(event), state)
))(makeEvent(action, selectors));
