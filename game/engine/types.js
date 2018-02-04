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
export type Timestamp = DOMHighResTimeStamp | number;
export type LoopState = {
  startTime: Timestamp,
  currentTime?: Timestamp,
  frameTime?: Timestamp,
};

export opaque type Id: string = string;

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

type Selector = string;
export type Selectors = Array<Selector>;

export type Action = mixed;

export type Event = {
  eventId: string,
  selectors: Selectors,
  action: Action
};

export type Events = Array<Event>;

export type CurrentScene = Id;

export type Scene = {|
  +id: Id,
  +systems: Array<Id>
|};

export type System = {|
  +id: Id,
  +label: string,
  +fn?: GameState => GameState,
  +component?: Component
|};

type EntityComponentSpec = {
  +id: Id,
  +state?: mixed,
  +fn?: GameState => mixed,
};

export type Entity = {|
  +id: Id,
  +label: string,
  +components: Array<EntityComponentSpec>
|};

export type Script = GameState => GameState;

export type Component = {|
  id: Id,
  // this fn function takes an entityId, the previous component state,
  // and an object that points the component state of the componentIds
  // (or componentId, entityId objects to give this component the state
  // of a specific entity), and returns either the next component state,
  // or an array of the next component state, and either a list of events,
  // or a single event.
  fn: () => mixed,
  +label: string,
  subscriptions?: Array<string>,
  cleanupFn?: () => mixed,
  context?: Array<Id>,
|};

export type Param = {
  +id: Id,
  parentId: Id,
  linkTo: Set<Id>,
  linkFrom: Set<Id>,
  children: Array<Id>,
};

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
  | Component
  | Entity

export type Spec = {
  +type: SpecType,
  +options: SpecOption,
};

/* eslint-disable no-use-before-define */
