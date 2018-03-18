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

type ComponentId = Id;
type EntityId = Id;
type EventTypeId = Id;

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
  +id: Id,
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
