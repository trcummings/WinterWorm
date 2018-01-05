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
export type ID = string;

export type GameState = {
  currentScene?: CurrentScene,
  scenes?: {
    [ID]: Scene
  },
  updateFns?: {
    [ID]: GameState => GameState
  },
  systems?: {
    [ID]: System
  },
};

export type CurrentScene = ID;

export type Scene = {|
  +id: ID,
  +systems: Array<ID>
|};

export type System = {|
  +id: ID,
  +fn?: GameState => GameState,
  +component?: Component
|};

export type Script = {|
  +fn: GameState => GameState
|};

export type Component = {|
  id: Id,
  fn: () => mixed,
  subscriptions?: Array<string>,
  cleanupFn?: () => mixed,
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
