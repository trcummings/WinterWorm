// @flow
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

export type ProcessType =
  | typeof MAIN
  | typeof BACKEND
  | typeof CONFIG
  | typeof EDITOR
  | typeof GAME;

// MAIN
export const END = 'end';
export const READY = 'ready';
export const WILL_QUIT = 'will-quit';

type MainEventTypes =
  | typeof END
  | typeof READY
  | typeof WILL_QUIT;


// BACKEND
export const REQUEST_START = 'REQUEST_START';
export const REQUEST_END = 'REQUEST_END';

type BackendEventTypes =
  | typeof REQUEST_START
  | typeof REQUEST_END;

// CONFIG
export const CLOSE_CONFIG = 'config/CLOSE_CONFIG';
export const INIT_START = 'config/INIT_START';
export const INIT_MESSAGE = 'config/INIT_MESSAGE';
export const INIT_ERROR = 'config/INIT_ERROR';
export const INIT_END = 'config/INIT_END';

type ConfigEventTypes =
  | typeof CLOSE_CONFIG
  | typeof INIT_START
  | typeof INIT_MESSAGE
  | typeof INIT_ERROR
  | typeof INIT_END;

// EDITOR
export const OPEN_EDITOR = 'editor/OPEN_EDITOR';
export const GET_EDITOR_CONFIG = 'editor/GET_EDITOR_CONFIG';
export const RECEIVE_EDITOR_CONFIG = 'editor/RECEIVE_EDITOR_CONFIG';
export const SET_FILENAME = 'editor/SET_FILENAME';

type EditorEventTypes =
  | typeof OPEN_EDITOR
  | typeof GET_EDITOR_CONFIG
  | typeof RECEIVE_EDITOR_CONFIG
  | typeof SET_FILENAME;

// GAME
export const OPEN_GAME_START = 'game/OPEN_GAME_START';
export const OPEN_GAME_FINISH = 'game/OPEN_GAME_FINISH';
export const INITIAL_ASSET_LOAD = 'game/INITIAL_ASSET_LOAD';
export const GAME_EVENT = 'game/GAME_EVENT';

export const SYNC = 'sync';
export const START_GAME = 'start_game';
export const MAXIMIZE = 'maximize';

export const CLOSED = 'closed';

export const PLAY = 'play';
export const PAUSE = 'pause';
export const REFRESH = 'refresh';
export const LOAD_SPEC = 'loadSpec';
export const SELECT_INSPECTOR_ENTITY = 'interactable/SELECT_INSPECTOR_ENTITY';
export const DRAG_ENTITY = 'interactable/DRAG_ENTITY';
export const UPDATE_COMPONENT_STATE = 'interactable/UPDATE_COMPONENT_STATE';
export const EMIT_QUEUE_EVENT = 'EMIT_QUEUE_EVENT';
export const EMIT_META_EVENT = 'EMIT_META_EVENT';

type GameEventTypes =
  | typeof OPEN_EDITOR
  | typeof GET_EDITOR_CONFIG
  | typeof RECEIVE_EDITOR_CONFIG
  | typeof SET_FILENAME
  | typeof OPEN_GAME_START
  | typeof OPEN_GAME_FINISH
  | typeof SYNC
  | typeof START_GAME
  | typeof MAXIMIZE
  | typeof CLOSED
  | typeof PLAY
  | typeof PAUSE
  | typeof REFRESH
  | typeof INITIAL_ASSET_LOAD
  | typeof GAME_EVENT
  | typeof SELECT_INSPECTOR_ENTITY
  | typeof DRAG_ENTITY
  | typeof UPDATE_COMPONENT_STATE
  | typeof EMIT_QUEUE_EVENT
  | typeof EMIT_META_EVENT
  | typeof LOAD_SPEC;


export type EventTypes =
  | MainEventTypes
  | BackendEventTypes
  | ConfigEventTypes
  | EditorEventTypes
  | GameEventTypes;
