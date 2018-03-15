import { CONFIG } from 'App/actionTypes';
import { getConfigDims } from 'App/utils/screenUtil';
import { startConfig } from 'App/utils/browserWindowUtil';
import { setProcess } from 'App/utils/stateUtil';

import { closeBackend } from './backend';

export const onRunMain = state => setProcess(CONFIG, startConfig(getConfigDims()), state);
export const onRequestCloseMain = closeBackend;
