import R from 'ramda';

export const getEvents = (state, selectors) => R.view(selectors, state);
export const makeEvent = (action, selectors) => ({ selectors, action });
export const emitEvent = (state, action, selectors) => (event => (
  R.over(selectors, R.merge(R._, event), state)
))(makeEvent(action, selectors));
