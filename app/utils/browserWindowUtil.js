import { BrowserWindow } from 'electron';

import { gameUrl, editorUrl } from '../htmlTemplates/types';

export const startEditor = (editorWindow = {}) => {
  const editor = new BrowserWindow({ ...editorWindow });
  if (!process.env.DEBUG_EDITOR) editor.webContents.openDevTools();
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
  if (!process.env.DEBUG_GAME) game.webContents.openDevTools();
  game.loadURL(gameUrl);

  return game;
};
