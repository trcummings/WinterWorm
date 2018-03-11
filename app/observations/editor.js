import { EDITOR } from 'App/actionTypes';
import { getEditorDims } from 'App/utils/screenUtil';
import { startEditor } from 'App/utils/browserWindowUtil';
import { setProcess } from 'App/utils/stateUtil';

export const onOpenEditor = state => (
  setProcess(EDITOR, startEditor(getEditorDims()), state)
);
