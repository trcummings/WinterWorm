// @flow

// system for updating planck-js's physics simulation
import { getPhysicsEngine } from '../planck';
import { makeId } from '../util';
import { SYSTEMS, PHYSICS_EVENT } from '../symbols';
import { getLoopState } from '../loop';
import { getEventsOfEventId } from '../events';

import type { System, GameState } from '../types';

const PHYSICS = 'physics';

const VELOCITY_ITERATIONS = 6;
const POSITION_ITERATIONS = 2;

// Updates all the physics bodies in the physics engine;
const physics: System = {
  label: PHYSICS,
  id: makeId(SYSTEMS),
  fn: (state: GameState): GameState => {
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
  },
};

export default physics;
