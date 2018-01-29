// @flow
import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { gameUrl, editorUrl } from './htmlTemplates/types';
import { configureStore } from './store';

import { isGameRunning } from '../editor/modules/preview';
import {
  isEditorSaving,
  isSpecExporting,
  EDITOR_SAVE_ERROR,
  EDITOR_SAVE_COMPLETE,
  SPEC_EXPORT_ERROR,
  SPEC_EXPORT_COMPLETE,
} from '../editor/modules/filesystem';
import {
  isConfigSaving,
  getConfigState,
  CONFIG_SAVE_ERROR,
  CONFIG_SAVE_COMPLETE,
} from '../editor/modules/config';
import { getSpecs } from '../editor/modules/specs';

const SYNC = 'sync';
const START_GAME = 'start_game';
const MAXIMIZE = 'maximize';

const READY = 'ready';
// const ALL_WINDOWS_CLOSED = 'window-all-closed';
// const ACTIVATE = 'activate';

const CLOSED = 'closed';

// const isPlatformDarwin = (): boolean => process.platform !== 'darwin';
// const quitApp = () => {
//   app.quit();
// };

const isProd = process.env.NODE_ENV === 'production';
const { store } = configureStore();

let editor;
let game;
let unsubscribe;

const startEditor = (editorWindow = {}) => {
  editor = new BrowserWindow({ ...editorWindow });
  // editor.webContents.openDevTools();
  editor.loadURL(editorUrl);
  editor.on(CLOSED, () => {
    editor = null;
    if (unsubscribe) unsubscribe();
  });
};

const startGame = (gameWindow = {}) => {
  game = new BrowserWindow({
    ...gameWindow,
    frame: false,
    resizeable: false,
    transparent: true,
  });
  // game.webContents.openDevTools();
  game.loadURL(gameUrl);
};

const makeConfigFilePath = filename => path.join(process.env.CONFIG_PATH, `${filename}.json`);
const writeFile = (filename, data, { onError, onSuccess }) => {
  try {
    const state = JSON.stringify(data);

    fs.writeFileSync(filename, state);
    onSuccess();
  }
  catch (err) {
    onError(err);
  }
};

const makeDispatch = ({ successType, errorType }) => ({
  onSuccess: () => store.dispatch({ type: successType }),
  onError: err => store.dispatch({ type: errorType, payload: err }),
});

const saveEditorFile = specs => writeFile(
  makeConfigFilePath(`editorFiles/editor_${Date.now()}`),
  specs,
  makeDispatch({
    successType: EDITOR_SAVE_COMPLETE,
    errorType: EDITOR_SAVE_ERROR,
  })
);

const CONFIG_FILE_PATH = makeConfigFilePath('gameConfig');
const saveConfigFile = config => writeFile(
  CONFIG_FILE_PATH,
  config,
  makeDispatch({
    successType: CONFIG_SAVE_COMPLETE,
    errorType: CONFIG_SAVE_ERROR,
  })
);

const SPECS_FILE_PATH = makeConfigFilePath('gameSpecs');
const saveSpecFile = gameSpecs => writeFile(
  SPECS_FILE_PATH,
  gameSpecs,
  makeDispatch({
    successType: SPEC_EXPORT_ERROR,
    errorType: SPEC_EXPORT_COMPLETE,
  })
);

const getScreenDims = () => {
  const display = screen.getPrimaryDisplay();
  const { size: { height, width } } = display;
  return { height, width };
};

let gameRunning;
let editorSaving;
let configSaving;
let specsSaving;
unsubscribe = store.subscribe(() => {
  const state = store.getState();

  if (!gameRunning && isGameRunning(state)) {
    gameRunning = true;
    const { height, width } = getScreenDims();
    startGame({ height, width: Math.floor((2 * width) / 3), x: 0, y: 0 });
  }
  else if (gameRunning && !isGameRunning(state)) {
    gameRunning = false;
    game.close();
    game = null;
  }

  if (!editorSaving && isEditorSaving(state)) {
    editorSaving = true;
    saveEditorFile(getSpecs(state));
  }
  else if (editorSaving && !isEditorSaving(state)) {
    editorSaving = false;
  }

  if (!configSaving && isConfigSaving(state)) {
    configSaving = true;
    saveConfigFile(getConfigState(state));
  }
  else if (configSaving && !isConfigSaving(state)) {
    configSaving = false;
  }

  if (!specsSaving && isSpecExporting(state)) {
    specsSaving = true;
    saveSpecFile(getSpecs(state));
  }
  else if (specsSaving && !isSpecExporting(state)) {
    specsSaving = false;
  }
});

app.on(READY, () => {
  if (isProd) startGame();
  else {
    const { height, width } = getScreenDims();
    const thirdWidth = Math.floor(width / 3);
    startEditor({ height, width: thirdWidth, x: thirdWidth * 2, y: 0 });
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

ipcMain.on(MAXIMIZE, () => {
  console.log('maximize game!');
  game.maximize();
});
