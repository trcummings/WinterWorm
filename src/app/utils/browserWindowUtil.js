import { BrowserWindow } from 'electron';

import { gameUrl, editorUrl, configUrl } from './windowPathUtil';

const windowFactory = (url, defaults = {}) => (windowDims = {}) => {
  const vindaga = new BrowserWindow({ ...defaults, ...windowDims });
  if (process.env.DEBUG) vindaga.webContents.openDevTools();
  vindaga.loadURL(url);

  return vindaga;
};

export const startEditor = windowFactory(editorUrl);
export const startConfig = windowFactory(configUrl, {
  resizeable: false,
});
export const startGame = windowFactory(gameUrl, {
  frame: false,
  resizeable: false,
  transparent: true,
});
