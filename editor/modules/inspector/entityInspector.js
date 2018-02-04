// // Action Types
// const SELECT_INSPECTOR = 'inspector/SELECT_INSPECTOR';
//
// // Action Creators
// export const selectInspector = ({ inspectorType, id }) => dispatch => dispatch({
//   type: SELECT_INSPECTOR,
//   payload: { inspectorType, id },
// });
//
// // Selectors
// export const getInspectorControl = state => state.inspector.control;
//
// // Reducer
// const INITIAL_STATE = {
//   parameters: {},
//   entity: {},
// };
//
// export default function control(state = INITIAL_STATE, action = {}) {
//   const { type, payload } = action;
//
//   switch (type) {
//     case SELECT_INSPECTOR: return payload;
//     default: return state;
//   }
// }
//
// export default inspector;
