// @flow
import { assoc } from 'ramda';
import { initialProcessState, getProcess } from 'App/utils/stateUtil';
import { BACKEND } from 'App/actionTypes';

export const closeBackend = (state) => {
  const backend = getProcess(BACKEND, state);
  if (backend) backend.send('SIGINT');
  return assoc(BACKEND, initialProcessState, state);
};
