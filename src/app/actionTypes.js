export const PROCESS = 'process';
export const STATE = 'state';
export const EFFECTS = 'effects';

export const MAIN = 'main';
export const BACKEND = 'backend';
export const CONFIG = 'config';
export const EDITOR = 'editor';
export const GAME = 'game';
export const processes = {
  MAIN,
  BACKEND,
  CONFIG,
  EDITOR,
  GAME,
};

// MAIN
export const END = 'end';
export const READY = 'ready';
export const WILL_QUIT = 'will-quit';

// BACKEND
export const REQUEST_START = 'REQUEST_START';
export const REQUEST_END = 'REQUEST_END';

// CONFIG
export const CLOSE_CONFIG = 'config/CLOSE_CONFIG';
export const INIT_START = 'config/INIT_START';
export const INIT_MESSAGE = 'config/INIT_MESSAGE';
export const INIT_ERROR = 'config/INIT_ERROR';
export const INIT_END = 'config/INIT_END';

// EDITOR
export const OPEN_EDITOR = 'editor/OPEN_EDITOR';
export const GET_EDITOR_CONFIG = 'editor/GET_EDITOR_CONFIG';
export const RECEIVE_EDITOR_CONFIG = 'editor/RECEIVE_EDITOR_CONFIG';
export const SET_FILENAME = 'editor/SET_FILENAME';

// GAME
export const OPEN_GAME_START = 'game/OPEN_GAME_START';
export const OPEN_GAME_FINISH = 'game/OPEN_GAME_FINISH';

export const SYNC = 'sync';
export const START_GAME = 'start_game';
export const MAXIMIZE = 'maximize';

export const CLOSED = 'closed';

export const PLAY = 'play';
export const PAUSE = 'pause';
export const REFRESH = 'refresh';
export const LOAD_SPEC = 'loadSpec';
