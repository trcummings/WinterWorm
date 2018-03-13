// @flow
import fs from 'fs';
import * as symbols from 'Symbols';
import { fork } from 'child_process';

import agent from 'App/dbAgent';
import { closeProcess } from 'App/utils/stateUtil';
import { BACKEND, REQUEST_END, REQUEST_ERROR } from 'App/actionTypes';

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

export const onRequest = async (state, event, { method, form, query, uri }) => {
  const resp = await agent[method]({ form, query, uri });
  if (resp.error) event.sender.send(REQUEST_ERROR, resp.error);
  else event.sender.send(REQUEST_END, resp);

  return state;
};

const getAllJson = basePath => (
  fs.readdirSync(basePath)
    .map(fPath => JSON.parse(fs.readFileSync(`${basePath}/${fPath}`, 'utf8')))
);

export const initDb = async () => {
  const eventTypes = Object.keys(symbols.events).map(label => ({ label }));
  const components = getAllJson(process.env.COMPONENT_SPEC_PATH);
  const systems = getAllJson(process.env.SYSTEM_SPEC_PATH);

  return await agent.post({ uri: 'init', form: { eventTypes, components, systems } });
};
