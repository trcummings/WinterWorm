// @flow

import * as symbols from './symbols';

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

export type Selector = string;
export type Selectors = Array<Selector>;

export type Action = mixed;

export type Event = {
  eventId: string,
  selectors: Selectors,
  action: Action
};

export type Events = Array<Event>;
export type EventType =
  | typeof symbols.KEYBOARD_INPUT
  | typeof symbols.POSITION_CHANGE
  | typeof symbols.ACCELERATION_CHANGE
  | typeof symbols.SCENE_CHANGE
  | typeof symbols.ANIMATION_CHANGE
  | typeof symbols.RENDER_ACTION
  | typeof symbols.PHYSICS_EVENT
  | typeof symbols.TIME_TICK;

export type SceneId = Id;
export type Scene = {|
  +id: SceneId,
  +systems: Array<SystemId>
|};

export type CurrentScene = SceneId;

export type SystemId = Id;
export type System = {|
  +id: SystemId,
  +label: string,
  +fn?: GameState => GameState,
  +component?: Component
|};

export type EntityComponentSpec = {
  +id: Id,
  +state?: mixed,
  +fn?: GameState => mixed,
};

export type EntityId = Id;
export type Entity = {|
  +id: EntityId,
  +label: string,
  +components: Array<EntityComponentSpec>
|};

export type Script = GameState => GameState;

export type ComponentId = Id;
export type Component = {|
  id: ComponentId,
  // this fn function takes an entityId, the previous component state,
  // and an object that points the component state of the componentIds
  // (or componentId, entityId objects to give this component the state
  // of a specific entity), and returns either the next component state,
  // or an array of the next component state, and either a list of events,
  // or a single event.
  fn: () => mixed,
  +label: string,
  subscriptions?: Array<EventType>,
  cleanupFn?: () => mixed,
  context?: Array<ComponentId>,
|};

export type SpecType =
  | typeof symbols.SCRIPTS
  | typeof symbols.SCENES
  | typeof symbols.SYSTEMS
  | typeof symbols.CURRENT_SCENE
  | typeof symbols.ENTITIES;

export type SpecOption =
  | Scene
  | System
  | CurrentScene
  | Component
  | Entity;

export type Spec = {
  +type: SpecType,
  +options: SpecOption,
};

/* eslint-disable no-use-before-define */
