import { ipcRenderer } from 'electron';
// import { __ } from 'ramda';
import 'babel-polyfill';

import {
  SYNC,
  START_GAME,
  // MAXIMIZE,
} from 'App/actionTypes';

import { isDev } from './engine/util';

import { setUpFpsMeter } from './engine/utils/fpsMeterUtil';
import { startGame } from './main';

// const swapLoaderWithCanvas = () => {
//   const loader = document.getElementById('loader');
//   if (!loader) return;
//   document.body.style['background-color'] = '#000000';
//   document.body.removeChild(loader);
// };

// const maximizeAfterLoad = (state) => {
//   if (!isDev()) ipcRenderer.send(MAXIMIZE);
//   swapLoaderWithCanvas();
//   return state;
// };


ipcRenderer.once(START_GAME, (_, data) => startGame(data));

document.addEventListener('DOMContentLoaded', () => {
  if (isDev()) setUpFpsMeter();
  ipcRenderer.send(SYNC);
});
