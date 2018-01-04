// @flow
// import { view, apply, compose, assocPath, reverse, lensPath, partial } from 'ramda';
import { view, apply, compose, assocPath, reverse, lensPath } from 'ramda';

import {
  SCENES,
  SYSTEMS,
  CURRENT_SCENE,
  UPDATE_FNS,
  SCRIPTS,
  // COMPONENTS,
  // ENTITIES,
} from './symbols';

import {
  currentSceneIdLens,
  getSystemFns,
  getUpdateFn,
  setCurrentScene,
  // setComponent,
  setScene,
  setSystem,
  // setEntity,
} from './ecs';

import type { GameState, SpecType, Spec } from './types';

const setStateFn = (type: SpecType) => {
  switch (type) {
    // case ENTITIES: {
    //   return (state: GameState, { options }): GameState => (
    //     setEntity(state, options)
    //   );
    // }
    // case COMPONENTS: {
    //   return (state: GameState, [_, ...args]): GameState => (
    //     apply(partial(setComponent, [state]), ...args)
    //   );
    // }
    case SCRIPTS: {
      return (state: GameState, { options }): GameState => {
        const { fn } = options;
        if (!fn) throw Error('missing fn in spec for script!');
        return fn(state);
      };
    }
    case SYSTEMS: {
      return (state: GameState, { options }): GameState => (
        setSystem(state, options)
      );
    }
    case SCENES: {
      return (state: GameState, { options }): GameState => (
        setScene(state, options)
      );
    }
    case CURRENT_SCENE: {
      return (state: GameState, { options }): GameState => (
        setCurrentScene(state, options)
      );
    }
    default: {
      return (_: GameState, ...args) => {
        throw new Error(`Could not dispatch: ${JSON.stringify(args, null, 2)}`);
      };
    }
  }
};

// takes the type and options from the game state item, creates it, and
// adds it to the state
export const setState = (state: GameState, spec: Spec): GameState => {
  const { type } = spec;
  const stateFn = setStateFn(type);
  return stateFn(state, spec);
};

// takes the type and options from the game state item, creates it, and
// adds it to the state

// takes an initial state (usually an empty object) and a spec array.
export const setGameState = (initialState: {}, ...specs: Array<Spec>) => {
  const state = specs.reduce(setState, initialState);
  const sceneId = view(currentSceneIdLens, state);

  if (!sceneId) throw new Error('Must have a CURRENT_SCENE scene in the spec!');

  // get the systems from the current scene
  const systemIds = view(lensPath([SCENES, sceneId, SYSTEMS]), state);
  const systemFns = getSystemFns(state, systemIds);

  // set a curried function to call each system function on the state
  // in order and return the next state
  const updateFn = apply(compose(...reverse(systemFns)));

  return assocPath([UPDATE_FNS, sceneId], updateFn, state);
};

export const nextState = (state: GameState) => {
  const updateFn = getUpdateFn(state);
  return updateFn(state);
};

// export const getEvents = (state, selectors) => view(selectors, state);
// export const makeEvent = (action, selectors) => ({ selectors, action });
// export const emitEvent = (state, action, selectors) => (event => (
//   over(selectors, conjoin(event), state)
// ))(makeEvent(action, selectors));
