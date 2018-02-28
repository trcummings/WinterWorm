/* eslint-disable no-constant-condition */
import { take, put, call, fork, select, all } from 'redux-saga/effects';


const createRootSaga = () => {
  function* watchGameRunning() {
    while (true) {
      if (yield take('REFRESH_GAME')) console.log('TOOK RUN GAME');
    }
  }

  return function* rootSaga() {
    yield all([
      fork(watchGameRunning),
      // fork(watchEditorSaving),
      // fork(watchConfigSaving),
      // fork(watchSpecExporting),
    ]);
  };
};

export default createRootSaga;
