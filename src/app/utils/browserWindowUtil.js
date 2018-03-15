import { BrowserWindow } from 'electron';

import { gameUrl, editorUrl, configUrl } from './windowPathUtil';

const windowFactory = (url, defaults = {}) => (windowDims = {}) => {
  const vindaga = new BrowserWindow({ ...defaults, ...windowDims });
  if (process.env.DEBUG) vindaga.webContents.openDevTools();
  vindaga.loadURL(url);

  return vindaga;
};

const noFrame = {
  frame: false,
  resizeable: false,
  transparent: true,
};

export const startEditor = windowFactory(editorUrl);
export const startGame = windowFactory(gameUrl, noFrame);
export const startConfig = windowFactory(configUrl, noFrame);
