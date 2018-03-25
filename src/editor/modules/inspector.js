// @flow
import { Map } from 'immutable';
import { SCENES, ENTITIES } from 'Game/engine/symbols';

import type { State, Dispatch, EntityId, SceneId } from 'Editor/types';

export type InspectorType = null | typeof SCENES | typeof ENTITIES;
export type InspectorId = null | EntityId | SceneId;

export type Inspector = {
  inspectorType: InspectorType,
  id: InspectorId
};

export type InspectorState = Map<$Keys<Inspector>, $Values<Inspector>>;

// Action Types
const SELECT_INSPECTOR = 'inspector/SELECT_INSPECTOR';

// Action Creators
type Action = {
  type: typeof SELECT_INSPECTOR,
  payload: Inspector
};

export const selectInspector =
  ({ inspectorType, id }: Inspector) =>
    (dispatch: Dispatch<Action>) =>
      dispatch({ type: SELECT_INSPECTOR, payload: { inspectorType, id } });

// Selectors
export const getInspectorControl = (state: State) => state.inspector;
const getInspectorProp =
  (prop: 'id' | 'inspectorType') =>
    (state: State) =>
      getInspectorControl(state).get(prop);

export const getInspectorId = getInspectorProp('id');
export const getInspectorType = getInspectorProp('inspectorType');

// Reducer
export const INITIAL_STATE: InspectorState = Map({
  inspectorType: null,
  id: null,
});

const inspector = (
  state: InspectorState = INITIAL_STATE,
  action: Action
): InspectorState => {
  const { type, payload } = action;

  switch (type) {
    case SELECT_INSPECTOR: return Map(payload);
    default: return state;
  }
};

export default inspector;
