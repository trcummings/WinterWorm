// @flow
import fs from 'fs';
import path from 'path';
import { compose } from 'ramda';
import {
  EDITOR_SAVE_ERROR,
  EDITOR_SAVE_COMPLETE,
  SPEC_EXPORT_ERROR,
  SPEC_EXPORT_COMPLETE,
} from '../../editor/modules/filesystem';
import {
  CONFIG_SAVE_ERROR,
  CONFIG_SAVE_COMPLETE,
} from '../../editor/modules/config';

const makeConfigFilePath = filename => path.join(process.env.CONFIG_PATH, `${filename}.json`);
export const writeFile = (filename, data, { onError, onSuccess }) => {
  try {
    const state = JSON.stringify(data);

    fs.writeFileSync(filename, state);
    onSuccess();
  }
  catch (err) {
    onError(err);
  }
};

const makeDispatch = dispatch => ({ successType, errorType }) => ({
  onSuccess: () => dispatch({ type: successType }),
  onError: err => dispatch({ type: errorType, payload: err }),
});

export const saveEditorFile = compose(dispatchFn => specs => writeFile(
  makeConfigFilePath(`editorFiles/editor_${Date.now()}`),
  specs,
  dispatchFn({
    successType: EDITOR_SAVE_COMPLETE,
    errorType: EDITOR_SAVE_ERROR,
  })
), makeDispatch);

export const CONFIG_FILE_PATH = makeConfigFilePath('gameConfig');
export const saveConfigFile = compose(dispatchFn => config => writeFile(
  CONFIG_FILE_PATH,
  config,
  dispatchFn({
    successType: CONFIG_SAVE_COMPLETE,
    errorType: CONFIG_SAVE_ERROR,
  })
), makeDispatch);

export const SPECS_FILE_PATH = makeConfigFilePath('gameSpecs');
export const saveSpecFile = compose(dispatchFn => gameSpecs => writeFile(
  SPECS_FILE_PATH,
  gameSpecs,
  dispatchFn({
    successType: SPEC_EXPORT_ERROR,
    errorType: SPEC_EXPORT_COMPLETE,
  })
), makeDispatch);

// unsubscribe = store.subscribe(() => {
//   const state = store.getState();
//
//   if (!gameRunning && isGameRunning(state)) {
//     gameRunning = true;
//     startGameDev();
//   }
//   else if (gameRunning && !isGameRunning(state)) {
//     gameRunning = false;
//     tearDownGame();
//   }
//
//   if (!editorSaving && isEditorSaving(state)) {
//     editorSaving = true;
//     saveEditorFile(getSpecs(state));
//   }
//   else if (editorSaving && !isEditorSaving(state)) {
//     editorSaving = false;
//   }
//
//   if (!configSaving && isConfigSaving(state)) {
//     configSaving = true;
//     saveConfigFile(getConfigState(state));
//   }
//   else if (configSaving && !isConfigSaving(state)) {
//     configSaving = false;
//   }
//
//   if (!specsSaving && isSpecExporting(state)) {
//     specsSaving = true;
//     saveSpecFile(getSpecs(state));
//   }
//   else if (specsSaving && !isSpecExporting(state)) {
//     specsSaving = false;
//   }
// });
