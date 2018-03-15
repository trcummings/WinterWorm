import fs from 'fs';
import { ipcRenderer } from 'electron';

import { CLOSE_CONFIG, OPEN_EDITOR } from 'App/actionTypes';

const getStats = (path, file) => new Promise(resolve => fs.lstat(`${path}/${file}`, (err, stats) => (
  err ? resolve([err]) : resolve([null, stats, file])
)));

const readdir = path => new Promise(resolve => fs.readdir(path, 'utf-8', (err, result) => (
  err ? resolve([err]) : resolve([null, result])
)));

const getFileStats = (path, files) => (
  Promise.all(files.map(file => getStats(path, file)))
    .then(results => results.map(([_, stats, name]) => ({ name, stats })))
);

export const getSortedFiles = path => (
  readdir(path).then(([_, files]) => (
    getFileStats(path, files)
      .then(stats => (stats.sort(({ stats: { ctime: ct1 } }, { stats: { ctime: ct2 } }) => {
        if (ct1 > ct2) return 1;
        else if (ct2 > ct1) return -1;
        return 0;
      })))
  ))
);

export const getFileSet = path => (
  readdir(path).then(([_, files = []]) => new Set(files))
);

export const closeConfig = () => ipcRenderer.send(CLOSE_CONFIG);

export const openEditor = () => ipcRenderer.send(OPEN_EDITOR);
