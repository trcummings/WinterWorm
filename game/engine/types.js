// @flow

import {
  SCENES,
  SYSTEMS,
  CURRENT_SCENE,
  SCRIPTS,
  // UPDATE_FNS,
  // COMPONENTS,
  // ENTITIES,
} from './symbols';

/* eslint-disable no-use-before-define */
export type Id = string;

export type GameState = {
  currentScene?: CurrentScene,
  scenes?: {
    [Id]: Scene
  },
  updateFns?: {
    [Id]: GameState => GameState
  },
  systems?: {
    [Id]: System
  },
};

export type CurrentScene = Id;

export type Scene = {|
  +id: Id,
  +systems: Array<Id>
|};

export type System = {|
  +id: Id,
  +fn?: GameState => GameState,
  +component?: Component
|};

export type Script = GameState => GameState;

export type Component = {|
  id: Id,
  fn: () => mixed,
  subscriptions?: Array<string>,
  cleanupFn?: () => mixed,
  setupFn?: () => mixed,
  context?: Array<Id>,
|};

export type SpecType =
  | typeof SCRIPTS
  | typeof SCENES
  | typeof SYSTEMS
  | typeof CURRENT_SCENE
  | typeof ENTITIES

export type SpecOption =
  | Scene
  | System
  | CurrentScene
  // | Component
  // | Entity

export type Spec = {
  +type: SpecType,
  +options: SpecOption,
};

/* eslint-disable no-use-before-define */
