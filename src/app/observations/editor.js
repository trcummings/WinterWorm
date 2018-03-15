import { EDITOR, RECEIVE_EDITOR_CONFIG } from 'App/actionTypes';
import { getEditorDims } from 'App/utils/screenUtil';
import { startEditor } from 'App/utils/browserWindowUtil';
import { getState, setProcess } from 'App/utils/stateUtil';

export const onOpenEditor = state => (
  setProcess(EDITOR, startEditor(getEditorDims()), state)
);

export const onGetEditorConfig = (state, event) => {
  const config = JSON.stringify(getState(EDITOR, state));
  event.sender.send(RECEIVE_EDITOR_CONFIG, config);
  return state;
};
