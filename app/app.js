// @flow
import fs from 'fs';
import { app, ipcMain } from 'electron';
import { configureStore } from './store';
import createRootSaga from './sagas';
import { createGameIpcMiddleware } from './ipcMiddleware';

import {
  SYNC,
  START_GAME,
  // MAXIMIZE,
  READY,
  // CLOSED,
} from './actionTypes';

import { getScreenDims, getEditorDims } from './utils/screenUtil';
import { startEditor, startGame } from './utils/browserWindowUtil';
import { CONFIG_FILE_PATH, SPECS_FILE_PATH } from './utils/filesystemUtils';
import initDb from './initDb';

const isProd = process.env.NODE_ENV === 'production';

const initialAppState = { editor: null, game: null };
const gameIpcMiddleware = createGameIpcMiddleware(initialAppState);
const { store } = configureStore(gameIpcMiddleware);

const rootSaga = createRootSaga();
store.runSaga(rootSaga);

app.on(READY, () => {
  if (isProd) startGame(getScreenDims());
  else {
    initDb((gameObjects) => {
      console.log(JSON.parse(gameObjects));
      // add entities to database on this one...
      startEditor(getEditorDims());
    });
  }
});

ipcMain.on(SYNC, (event) => {
  let specs;
  let config;
  if (isProd) {
    try {
      specs = JSON.parse(fs.readFileSync(SPECS_FILE_PATH, 'utf8'));
      config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf8'));
    }
    catch (err) {
      throw new Error(err);
    }
  }
  else {
    const state = store.getState();
    specs = state.specs;
    config = state.config;
  }
  // once the game window dom content is loaded, start the game
  event.sender.send(START_GAME, { specs, config });
});

// if (isProd) ipcMain.on(MAXIMIZE, () => game.setFullScreen(true));
