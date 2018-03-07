// @flow
import { app, ipcMain } from 'electron';

// import { loadGameObjects } from 'Editor/modules/data';

import { configureStore } from './store';
import { createGameIpcMiddleware } from './ipcMiddleware';
import initDb from './initDb';

import {
  SYNC,
  START_GAME,
  // MAXIMIZE,
  READY,
  // CLOSED,
  INIT_START, INIT_MESSAGE, INIT_END,
  CLOSE_CONFIG, OPEN_EDITOR, SET_FILENAME,
} from './actionTypes';

import { getScreenDims, getEditorDims, getConfigDims } from './utils/screenUtil';
import { startEditor, startGame, startConfig } from './utils/browserWindowUtil';
import { CONFIG_FILE_PATH, SPECS_FILE_PATH } from './utils/filesystemUtils';
import { mkdir, initBackend } from './utils/backendUtil';

app.on(READY, () => {
  const initialAppState = {
    editor: null,
    game: null,
    config: null,
    backend: null,
    filename: '',
  };

  const gameIpcMiddleware = createGameIpcMiddleware(initialAppState);
  const { store } = configureStore(gameIpcMiddleware);
  // const isProd = process.env.NODE_ENV === 'production';

  // load file by file name in editorFiles, creating a new one if it doesn't
  ipcMain.on(INIT_START, async (evt, { filename, isNew }) => {
    const makeFile = async () => {
      initialAppState.filename = filename;
      // if new, we want to create the folder for all this to live in
      if (isNew) await mkdir(filename);
      return 'Spinning up Neodynium Ass Crystals...';
    };

    const makeBackend = async () => {
      initialAppState.backend = await initBackend({ isNew, filename });
      return 'Mobbin Deep B...';
    };

    const makeDb = async () => {
      if (isNew) await initDb();
      return null;
    };

    const tasks = [makeFile, makeBackend, makeDb];

    ipcMain.on(INIT_MESSAGE, async (event) => {
      const fn = tasks.shift();
      const message = await fn();

      console.log('message!', message, tasks);

      return tasks.length > 0
        ? event.sender.send(INIT_MESSAGE, message)
        : event.sender.send(INIT_END);
    });

    evt.sender.send(INIT_MESSAGE, 'Birthing abberations...');
  });

  ipcMain.on(CLOSE_CONFIG, () => {
    initialAppState.config = null;

    if (initialAppState.backend) {
      initialAppState.backend = null;
      initialAppState.backend.send('SIGTERM');
    }

    app.quit();
  });

  ipcMain.on(OPEN_EDITOR, (_, filename) => {
    console.log(filename);

    initialAppState.config = null;

    store.dispatch({ type: SET_FILENAME, payload: filename });

    initialAppState.editor = startEditor(getEditorDims());
  });

  // when the browser window syncs for the game, launch the game
  ipcMain.on(SYNC, (event) => {
    let specs;
    let config;
    // if (isProd) {
    //   try {
    //     specs = JSON.parse(fs.readFileSync(SPECS_FILE_PATH, 'utf8'));
    //     config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf8'));
    //   }
    //   catch (err) {
    //     throw new Error(err);
    //   }
    // }
    // else {
    const state = store.getState();
    specs = state.specs;
    config = state.config;
    // }
    // once the game window dom content is loaded, start the game
    event.sender.send(START_GAME, { specs, config });
  });

  // if (isProd) startGame(getScreenDims());
  // else {
  initialAppState.config = startConfig(getConfigDims());
  // initDb(agent, (gameObjects) => {
  //   const payload = JSON.parse(gameObjects);
  //   loadGameObjects(payload)(store.dispatch);
  //   startEditor(getEditorDims());
  // });
  // }
});

// if (isProd) ipcMain.on(MAXIMIZE, () => game.setFullScreen(true));
