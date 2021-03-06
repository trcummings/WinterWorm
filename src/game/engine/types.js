// @flow

import * as symbols from './symbols';

/* eslint-disable no-use-before-define */
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

type Contexts = Array<ComponentId>;
export type ComponentStateSpec = {
  +id: Id,
  +state?: mixed,
  +fn: (ComponentId, mixed, Contexts, GameState) => [mixed, GameState],
};

export type EntityId = Id;
export type Entity = {|
  +id: EntityId,
  +label: string,
  +components: Array<ComponentStateSpec>
|};

export type Script = GameState => GameState;

export type ComponentLabel = string;
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
  +label: ComponentLabel,
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

export type ComponentFn<ComponentState, Context> = (
  EntityId,
  ComponentState,
  { [ComponentLabel]: $Values<Context>, inbox: Events }
) => [ComponentState, Events];

export type ComponentStateFn<ComponentState, Context> = (
  EntityId,
  ComponentState,
  { [ComponentLabel]: $Values<Context> },
  GameState,
) => [ComponentState, GameState];

/* eslint-disable no-use-before-define */
