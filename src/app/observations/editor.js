// @flow
import { type Event } from 'electron';
import { EDITOR, RECEIVE_EDITOR_CONFIG } from 'App/actionTypes';
import { getEditorDims } from 'App/utils/screenUtil';
import { startEditor } from 'App/utils/browserWindowUtil';
import { getState, setProcess, type State } from 'App/utils/stateUtil';

export type EditorState = {
  isNew?: boolean,
  filename?: string,
};

export type EditorConfigPayload = string;

export const toEditorConfigPayload = (editorConfig: EditorState): EditorConfigPayload => (
  JSON.stringify(editorConfig)
);

export const fromEditorConfigPayload = (resp: EditorConfigPayload): EditorState => (
  JSON.parse(resp)
);

export const onOpenEditor = (state: State): State => (
  setProcess(EDITOR, startEditor(getEditorDims()), state)
);

export const onGetEditorConfig = (state: State, event: Event): State => {
  const config = toEditorConfigPayload(getState(EDITOR, state));
  event.sender.send(RECEIVE_EDITOR_CONFIG, config);
  return state;
};
