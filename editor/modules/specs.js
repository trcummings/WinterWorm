// import { specs as initialSpecs } from '../../game/game';

const ADD_SPEC = 'specs/ADD_SPEC';
// const REMOVE_SPEC = 'specs/REMOVE_SPEC';

const INITIAL_STATE = [];
export default function specs(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case ADD_SPEC: return [...state, payload];
    default: return state;
  }
}
