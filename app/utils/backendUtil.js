import fs from 'fs';
import { fork } from 'child_process';

const makeFolderPath = name => `${process.env.EDITOR_FILES_PATH}/${name}`;

export const mkdir = folderName => new Promise(resolve => (
  fs.mkdir(makeFolderPath(folderName), resolve)
));

export const initBackend = ({ filename, isNew }) => new Promise((resolve) => {
  const backend = fork('./backend/index.js', [filename], { env: { INIT_DB: isNew } });
  return backend.on('SYNC_COMPLETE', () => {
    console.log('sync complete!');
    resolve();
  });
});
