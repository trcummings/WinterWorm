/* eslint-disable no-constant-condition */
import { take, put, call, fork, select, all } from 'redux-saga/effects';

import { RUN_GAME, STOP_GAME, isGameRunning } from '../editor/modules/preview';
// import { isGameRunning } from '../editor/modules/preview';

function* watchGameRunning() {
  while (true) {
    console.log('running saga');
    const run = yield take(RUN_GAME);
    console.log(run);
  }
}
// function* watchEditorSaving() {
//   while (true) {
//     const { login } = yield take(actions.LOAD_MORE_STARRED);
//     yield fork(loadStarred, login, true);
//   }
// }
// function* watchConfigSaving() {
//   while (true) {
//     const { login } = yield take(actions.LOAD_MORE_STARRED);
//     yield fork(loadStarred, login, true);
//   }
// }
// function* watchSpecExporting() {
//   while (true) {
//     const { login } = yield take(actions.LOAD_MORE_STARRED);
//     yield fork(loadStarred, login, true);
//   }
// }

export default function* rootSaga() {
  yield all([
    fork(watchGameRunning),
    // fork(watchEditorSaving),
    // fork(watchConfigSaving),
    // fork(watchSpecExporting),
  ]);
}
