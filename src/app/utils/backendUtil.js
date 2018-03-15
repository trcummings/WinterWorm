import fs from 'fs';
import { fork } from 'child_process';

const editorFilesPath = process.env.EDITOR_FILES_PATH;
const makeFolderPath = name => `${editorFilesPath}/${name}`;

const makeEditorFilesFolder = () => new Promise((resolve) => {
  try {
    fs.lstatSync(editorFilesPath);
  }
  catch (err) {
    return fs.mkdir(editorFilesPath, e => resolve([e]));
  }
  return resolve([]);
});

export const mkdir = folderName => new Promise(resolve => (
  makeEditorFilesFolder().then(() => (
    fs.mkdir(makeFolderPath(folderName), resolve)
  ))
));

export const initBackend = ({ filename, isNew }) => new Promise((resolve) => {
  const backend = fork('./backend/index.js', [filename], { env: { INIT_DB: isNew } });

  backend.on('message', ({ type, payload }) => {
    switch (type) {
      case 'ERROR': {
        resolve([payload]);
        break;
      }

      case 'SYNC': {
        resolve([null, backend]);
        break;
      }

      default: break;
    }
  });
});
