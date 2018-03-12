// @flow
import { fork } from 'child_process';
import { closeProcess } from 'App/utils/stateUtil';
import { BACKEND } from 'App/actionTypes';

export const initBackend = (state, { isNew, filename }) => new Promise((resolve) => {
  const backend = fork('./backend/index.js', [filename], { env: { INIT_DB: isNew } });

  backend.on('message', ({ type, payload }) => {
    switch (type) {
      case 'ERROR': return resolve([payload]);
      case 'SYNC': return resolve([null, backend]);
      default: return resolve([new Error('Uncaught message from backend!')]);
    }
  });
});

export const closeBackend = state => (
  closeProcess(BACKEND, state, backend => backend.kill())
);
