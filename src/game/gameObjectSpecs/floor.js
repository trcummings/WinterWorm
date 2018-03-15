// // @flow
// import { makeId } from '../engine/util';
// import {
//   fixture,
//   rigidBody,
// } from '../engine/components';
// import { ENTITIES } from '../engine/symbols';
// import { getPhysicsEngine, Vector2D, Edge } from '../engine/planck';
//
// import type { Entity, GameState } from '../engine/types';
//
// const FLOOR = 'floor';
//
// const makeRigidBody = (state: GameState) => {
//   const world = getPhysicsEngine(state);
//   const body = world.createBody();
//
//   const groundFD = {
//     density: 0.0,
//     friction: 0.6,
//   };
//
//   body.createFixture(Edge(Vector2D(0.0, 0.0), Vector2D(40.0, 0.0)), groundFD);
//   return body;
// };
//
// const floor: Entity = {
//   id: makeId(ENTITIES),
//   label: FLOOR,
//   components: [
//     { id: rigidBody.id,
//       fn: makeRigidBody },
//     { id: fixture.id,
//       state: undefined },
//   ],
// };
//
// export default floor;
