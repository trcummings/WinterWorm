// @flow
import type { GameState, Script } from '../types';

const setupAllComponents: Script = (state: GameState): GameState => {
  const components = state.components;
  const componentIds = Object.keys(state.components);

  return componentIds.reduce((nextState, cId) => {
    const { setupFn, entities } = components[cId];
    if (!setupFn) return nextState;
    return entities.reduce(setupFn, nextState);
  }, state);
};

export default setupAllComponents;
