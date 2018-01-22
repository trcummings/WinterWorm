// @flow

import { app, BrowserWindow } from 'electron';
import { gameUrl, editorUrl } from './htmlTemplates/types';
import { configureStore } from './store';

import { isGameRunning, stopGame } from '../editor/modules/preview';

const READY = 'ready';
// const ALL_WINDOWS_CLOSED = 'window-all-closed';
// const ACTIVATE = 'activate';

const CLOSED = 'closed';

// const isPlatformDarwin = (): boolean => process.platform !== 'darwin';
// const quitApp = () => {
//   app.quit();
// };

const { store } = configureStore();

let editor;
let game;

const startEditor = () => {
  editor = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: false,
  });

  editor.webContents.openDevTools();
  editor.loadURL(editorUrl);

  // close both windows if the editor closes
  editor.on(CLOSED, () => {
    editor = null;
    game = null;
  });
};

const startGame = () => {
  game = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: false,
  });

  game.webContents.openDevTools();
  game.loadURL(gameUrl);

  // close both windows if the editor closes
  editor.on(CLOSED, () => {
    game = null;
    // reset the redux state too
    store.dispatch(stopGame());
  });
};

store.subscribe(() => {
  if (isGameRunning(store.getState())) startGame();
});

app.on(READY, startEditor);

// function window(): SetupWindow {
//   // Create the browser window.
//   let win1 = new BrowserWindow({
//     width: 800,
//     height: 600,
//     frame: false,
//     transparent: false,
//   });
//
//   let win2 = new BrowserWindow({
//     width: 800,
//     height: 600,
//     transparent: false,
//   });
//
//   win2.webContents.openDevTools();
//
//   // Dereference the window object
//   win1.on('closed', () => (win1 = null));
//   win2.on('closed', () => (win2 = null));
//
//   // load the current htmlTemplate of the app.
//   win1.loadURL(gameUrl);
//   win2.loadURL(editorUrl);
//
//   return [win1, win2];
// }

// const Running = 'app/running';
// const Quitting = 'app/quitting';
//
// opaque type RunningApp : Running = Running;
// opaque type QuittingApp : Running = Quitting;
// opaque type Action : string = READY | ALL_WINDOWS_CLOSED | ACTIVATE;
//
// type AppState = typeof RunningApp | typeof QuittingApp;
// type AppWindow =
//   | SetupWindow
//   | PreloadWindow
//   | GameWindow
//   | null;
//
// type AppModel = {
//   appState: AppState,
//   appWindow: AppWindow,
// };
//
// const initialModel = {
//   appWindow: null,
//   appState: Running,
// };
//
// let model = initialModel;
//
// const view = (currentModel: AppModel) => {
//   switch (currentModel.appState) {
//     case Quitting: {
//       // On macOS it is common for applications and their menu bar
//       // to stay active until the user quits explicitly with Cmd + Q
//       if (isPlatformDarwin()) quitApp();
//       return;
//     }
//
//     case Running:
//     default: return;
//   }
// };
//
// const update = (action: Action) => () => {
//   switch (action) {
//     case READY: {
//       model = { appWindow: window(), appState: Running };
//       break;
//     }
//
//     case ALL_WINDOWS_CLOSED: {
//       model = { ...model, appState: Quitting };
//       break;
//     }
//
//     case ACTIVATE: {
//       if (!model.appWindow) model = { appWindow: window(), appState: Running };
//       break;
//     }
//
//     default: break;
//   }
//
//   view(model);
// };
//
// const main = () => {
//   app.on(READY, update(READY));
//   app.on(ALL_WINDOWS_CLOSED, update(ALL_WINDOWS_CLOSED));
//   app.on(ACTIVATE, update(ACTIVATE));
// };
//
// main();
