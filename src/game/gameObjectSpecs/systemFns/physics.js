// @flow

// system for updating planck-js's physics simulation
import { getPhysicsEngine } from 'Engine/planck';
import { PHYSICS_EVENT } from 'Engine/symbols';
import { getLoopState } from 'Engine/loop';
import { getEventsOfEventId } from 'Engine/events';

import type { GameState } from 'Types';

// const VELOCITY_ITERATIONS = 6;
// const POSITION_ITERATIONS = 2;

// Updates all the physics bodies in the physics engine;
export default (state: GameState): GameState => {
  const world = getPhysicsEngine(state);
  const loopState = getLoopState(state);
  const events = getEventsOfEventId(state, PHYSICS_EVENT);
  if (events.length > 0) console.log(events);

  world.step(loopState.frameTime);

  // for (let body = world.getBodyList(); body; body = body.getNext()) {
  //   console.log(body);
  //   for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
  //     console.log(fixture);
  //     debugger; // eslint-disable-line
  //   }
  // }

  return state;
};
