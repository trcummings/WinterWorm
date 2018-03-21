// @flow
import { ipcRenderer } from 'electron';
import { GAME_TO_EDITOR } from 'Game/engine/symbols';
import { getEventsOfEventId } from 'Game/engine/events';

import type { GameState } from 'Types';

export default (state: GameState): GameState => {
  // build up the events from the copy
  const events = getEventsOfEventId(state, GAME_TO_EDITOR);

  events.forEach(({ action }) => {
    console.log(action);
    ipcRenderer.send(GAME_TO_EDITOR, action);
  });

  return state;
};
