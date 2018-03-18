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

export type Component = {
  +id: Id,
  +label: Label,
  +contract: null | mixed,
  +isFactory: boolean,
};

export type System = {
  +id: Id,
  +label: Label,
  +componentId: null | Id,
};

export type EventType = {
  +id: Id,
  +label: Label,
};

export type Entity = {
  +id: Id,
  +label: Label,
};

export type Scene = {
  +id: Id,
  +label: Label,
};

export type ComponentState = {
  +id: Id,
  +active: boolean,
  +state: mixed,
  +entityId: Id,
  +componentId: Id,
};
