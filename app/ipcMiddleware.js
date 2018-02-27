// @flow

import {
  RUN_GAME,
  STOP_GAME,
} from 'Editor/modules/preview';
import {
  EDITOR_SAVE_START,
  SPEC_EXPORT_START,
} from 'Editor/modules/filesystem';
import {
  getConfigState,
  CONFIG_SAVE_START,
} from 'Editor/modules/config';
import { getSpecs } from 'Editor/modules/specs';

import {
  // PLAY,
  // PAUSE,
  REFRESH,
  // LOAD_SPEC,
} from './actionTypes';
import { getDevDims } from './utils/screenUtil';
import { startGame } from './utils/browserWindowUtil';
import {
  saveEditorFile,
  saveConfigFile,
  saveSpecFile,
} from './utils/filesystemUtils';

export const createGameIpcMiddleware = appState => store => next => (action) => {
  const { type } = action;
  const { getState, dispatch } = store;

  switch (type) {
    case RUN_GAME: {
      appState.game = startGame(getDevDims()); // eslint-disable-line no-param-reassign
      break;
    }

    case STOP_GAME: {
      appState.game.close();
      appState.game = null; // eslint-disable-line no-param-reassign
      break;
    }

    case EDITOR_SAVE_START: {
      saveEditorFile(dispatch)(getSpecs(getState()));
      break;
    }

    case SPEC_EXPORT_START: {
      saveConfigFile(dispatch)(getConfigState(getState()));
      break;
    }

    case CONFIG_SAVE_START: {
      saveSpecFile(dispatch)(getSpecs(getState()));
      break;
    }

    case 'REFRESH_GAME': {
      // pass it in twice so that the payload in the game is the same
      // as it is in queueMiddleare's args
      appState.game.send(REFRESH, REFRESH);
      break;
    }

    default: break;
  }

  return next(action);
};
