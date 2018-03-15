// @flow
import { view, lensProp } from 'ramda';

import { removeEntity } from '../ecs';
import { ENTITIES } from '../symbols';

import type { Script, GameState } from '../types';

const removeAllEntities: Script = (state: GameState): GameState => {
  const entityIds = Object.keys(view(lensProp(ENTITIES), state) || {});
  const next = entityIds.reduce(removeEntity, state);
  return next;
};

export default removeAllEntities;
