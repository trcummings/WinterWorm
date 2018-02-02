import { BrowserWindow } from 'electron';

import { gameUrl, editorUrl } from '../htmlTemplates/types';

const isProd = process.env.NODE_ENV === 'production';

export const startEditor = (editorWindow = {}) => {
  const editor = new BrowserWindow({ ...editorWindow });
  if (!isProd) editor.webContents.openDevTools();
  editor.loadURL(editorUrl);

  return editor;
};

export const startGame = (gameWindow = {}) => {
  const game = new BrowserWindow({
    ...gameWindow,
    frame: false,
    resizeable: false,
    transparent: true,
  });
  if (!isProd) game.webContents.openDevTools();
  game.loadURL(gameUrl);

  return game;
};
