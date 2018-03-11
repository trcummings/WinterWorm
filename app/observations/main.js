import { assocPath, pipe } from 'ramda';
import { CONFIG } from 'App/actionTypes';
import { getConfigDims } from 'App/utils/screenUtil';
import { startConfig } from 'App/utils/browserWindowUtil';
import { signalEnd } from 'App/utils/stateUtil';

import { closeBackend } from './backend';

export const onRunMain = state => (
  assocPath([CONFIG, 'process'], startConfig(getConfigDims()), state)
);

export const onRequestCloseMain = pipe(closeBackend, signalEnd);
