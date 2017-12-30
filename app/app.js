// @flow

import { app, BrowserWindow } from 'electron';
import { setupUrl } from './htmlTemplates/types';

const READY = 'ready';
const ALL_WINDOWS_CLOSED = 'window-all-closed';
const ACTIVATE = 'activate';

const isPlatformDarwin = (): boolean => process.platform !== 'darwin';
const quitApp = () => {
  app.quit();
};

function window(): SetupWindow {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: false,
    backgroundColor: '#2e2c29',
  });

  // Dereference the window object
  win.on('closed', () => (win = null));

  // load the current htmlTemplate of the app.
  win.loadURL(setupUrl);

  return win;
}

const Running = 'app/running';
const Quitting = 'app/quitting';

opaque type RunningApp : string = Running;
opaque type QuittingApp : string = Quitting;
opaque type Action : string = READY | ALL_WINDOWS_CLOSED | ACTIVATE;

type AppState = RunningApp | QuittingApp;
type AppWindow =
  | SetupWindow
  | PreloadWindow
  | GameWindow
  | null;

type AppModel = {
  appState: AppState,
  appWindow: AppWindow,
};

const initialModel = {
  appWindow: null,
  appState: Running,
};

let model = initialModel;

const view = (currentModel: AppModel) => {
  switch (currentModel.appState) {
    case Running: {
      return;
    }

    case Quitting: {
      // On macOS it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (isPlatformDarwin()) quitApp();
      return;
    }

    default: return;
  }
};

const update = (action: Action) => () => {
  switch (action) {
    case READY: {
      model = { appWindow: window(), appState: Running };
      break;
    }

    case ALL_WINDOWS_CLOSED: {
      model = { ...model, appState: Quitting };
      break;
    }

    case ACTIVATE: {
      if (!model.appWindow) model = { appWindow: window(), appState: Running };
      break;
    }

    default: break;
  }

  view(model);
};

const main = () => {
  app.on(READY, update(READY));
  app.on(ALL_WINDOWS_CLOSED, update(ALL_WINDOWS_CLOSED));
  app.on(ACTIVATE, update(ACTIVATE));
};

main();
