// @flow
import { Map } from 'immutable';

import type { State, Dispatch } from 'Editor/types';
import { type Name } from '../containers/Collapse';

type MapOrExistence = Map<Name, MapOrExistence>;
type WindowState = Map<Name, MapOrExistence>;

// Action Types
const TOGGLE_WINDOW = 'windows/TOGGLE_WINDOW';
const ADD_WINDOW = 'windows/ADD_WINDOW';
const REMOVE_WINDOW = 'windows/REMOVE_WINDOW';

type ActionType =
  | typeof TOGGLE_WINDOW
  | typeof ADD_WINDOW
  | typeof REMOVE_WINDOW;

type Action<AT> = {
  +type: AT,
  +payload: Array<Name>,
};

// Action Creators
const windowAction =
  (type: ActionType) =>
    (names: Array<Name>) =>
      (dispatch: Dispatch<Action<ActionType>>) =>
        dispatch({ type, payload: names });

export const addWindow = windowAction(ADD_WINDOW);
export const removeWindow = windowAction(REMOVE_WINDOW);
export const toggleWindow = windowAction(TOGGLE_WINDOW);

// Selectors
export const getAllWindows = (state: State) => state.windows;

// Reducer
export const IS_COLLAPSED = 'isCollapsed';
const INITIAL_STATE = Map();

const windows = (
  state: WindowState = INITIAL_STATE,
  action: Action<ActionType>
): WindowState => {
  const { type, payload: names = [] } = action;
  const collapsePath = [...names, IS_COLLAPSED];

  switch (type) {
    case ADD_WINDOW:
      return state.hasIn(collapsePath)
        ? state
        : state.setIn(collapsePath, false);

    case REMOVE_WINDOW:
      return state.deleteIn(names);

    case TOGGLE_WINDOW:
      return state.setIn(collapsePath, !state.getIn(collapsePath));

    default: return state;
  }
};

export default windows;
