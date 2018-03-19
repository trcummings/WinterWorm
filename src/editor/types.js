// @flow
import type uuid from 'uuid';

export type State = {
  [string]: | State => $ElementType<State, string> | State
};
export type GetState = () => State;
export type ThunkAction<A> = (dispatch: Dispatch<A>, getState: GetState) => *;
export type PromiseAction<A> = Promise<A>;
export type Dispatch<A> = (
  action: A | ThunkAction<A> | PromiseAction<A>
) => *;

export type Id = uuid;
export type Label = string;

export type ComponentId = Id;
export type EntityId = Id;
export type EventTypeId = Id;
export type SceneId = Id;

export type Component = {
  +id: ComponentId,
  +label: Label,
  +contract: null | mixed,
  +isFactory: boolean,
  +subscriptions: Array<EventTypeId>,
  +contexts: Array<ComponentId>,
};

export type System = {
  +id: Id,
  +label: Label,
  +componentId: null | ComponentId,
  +devOnly: boolean,
  +active: boolean,
  +partition: 'pre' | 'main' | 'post',
  +orderIndex: number,
};

export type EventType = {
  +id: EventTypeId,
  +label: Label,
};

export type Entity = {
  +id: Id,
  +label: Label,
};

export type Scene = {
  +id: SceneId,
  +label: Label,
  +entities: Array<EntityId>
};

export type ComponentState = {
  +id: Id,
  +active: boolean,
  +state: mixed,
  +entityId: EntityId,
  +componentId: ComponentId,
};
