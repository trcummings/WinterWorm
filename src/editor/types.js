// @flow
export type State = {
  [string]: | State => $ElementType<State, string> | State
};
export type GetState = () => State;
export type ThunkAction<A> = (dispatch: Dispatch<A>, getState: GetState) => *;
export type PromiseAction<A> = Promise<A>;
export type Dispatch<A> = (
  action: A | ThunkAction<A> | PromiseAction<A>
) => *;
