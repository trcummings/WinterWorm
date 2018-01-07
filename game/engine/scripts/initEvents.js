// @flow
import { clearEventQueue } from '../events';

import type { Script } from '../types';

const initEvents: Script = clearEventQueue;

export default initEvents;
