// @flow
// Convenience methods for dealing with Planck.js

import planck from 'planck-js';
import { assoc, view, lensProp } from 'ramda';

import { PHYSICS_ENGINE } from './symbols';

import type { GameState } from './types';

export const World = planck.World;
export const Vector2D = planck.Vec2;
export const Edge = planck.Edge;
export const Box = planck.Box;

export const createPhysicsEngine = () => new World();

export const getPhysicsEngine = state => view(lensProp(PHYSICS_ENGINE), state);

export const setPhysicsEngine = (state: GameState, options): GameState => (
  assoc(PHYSICS_ENGINE, options, state)
);
