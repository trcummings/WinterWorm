import { ipcRenderer as ipc, webContents } from 'electron';

webContents.openDevTools();

const webview = document.querySelector('webview.hide');
console.log('got here!', webview);
webview.addEventListener('dom-ready', () => {
  webContents.openDevTools();
  debugger; //eslint-disable-line
  ipc.send('setup-page-message', 'piss hell!!', true);
});
