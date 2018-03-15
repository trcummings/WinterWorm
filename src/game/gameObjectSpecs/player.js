// // @flow
// import path from 'path';
//
// import { makeId } from '../engine/util';
// import { setState } from '../engine/core';
// import {
//   positionable,
//   animateable,
//   accelerable,
//   inputControllable,
//   moveable,
//   renderable,
//   fixture,
//   rigidBody,
//   utils,
// } from '../engine/components';
// import { ENTITIES, ANIMATION_CHANGE, ACCELERATION_CHANGE } from '../engine/symbols';
// import { makeAnimations, getRenderEngine, texturePathByFrame } from '../engine/pixi';
// import { getPhysicsEngine, Vector2D, Box } from '../engine/planck';
//
// import type { GameState, Entity } from '../engine/types';
//
// const PLAYER = 'player';
//
// const CLIMB = 'climb';
// const DUCK_L = 'duck_l';
// const DUCK_R = 'duck_r';
// const HURT_L = 'hurt_l';
// const HURT_R = 'hurt_r';
// const IDLE = 'idle';
// const JUMP_L = 'jump_l';
// const JUMP_R = 'jump_r';
// const STAND_L = 'stand_l';
// const STAND_R = 'stand_r';
// const SWIM_L = 'swim_l';
// const SWIM_R = 'swim_r';
// const WALK_L = 'walk_l';
// const WALK_R = 'walk_r';
//
// const atlasPath = path.resolve(process.env.ASSET_PATH, './player/player.json');
// export const animationLoaderSpec = {
//   name: PLAYER,
//   path: atlasPath,
// };
//
// const animationSpecs = {
//   [IDLE]: {    animName: IDLE,    numFrames: 1, fps: 6 },
//   [CLIMB]: {   animName: CLIMB,   numFrames: 2, fps: 6 },
//   [DUCK_L]: {  animName: DUCK_L,  numFrames: 1, fps: 6 },
//   [DUCK_R]: {  animName: DUCK_R,  numFrames: 1, fps: 6 },
//   [HURT_L]: {  animName: HURT_L,  numFrames: 1, fps: 6 },
//   [HURT_R]: {  animName: HURT_R,  numFrames: 1, fps: 6 },
//   [JUMP_L]: {  animName: JUMP_L,  numFrames: 1, fps: 6 },
//   [JUMP_R]: {  animName: JUMP_R,  numFrames: 1, fps: 6 },
//   [STAND_L]: { animName: STAND_L, numFrames: 1, fps: 6 },
//   [STAND_R]: { animName: STAND_R, numFrames: 1, fps: 6 },
//   [SWIM_L]: {  animName: SWIM_L,  numFrames: 2, fps: 6 },
//   [SWIM_R]: {  animName: SWIM_R,  numFrames: 2, fps: 6 },
//   [WALK_L]: {  animName: WALK_L,  numFrames: 2, fps: 6 },
//   [WALK_R]: {  animName: WALK_R,  numFrames: 2, fps: 6 },
// };
//
// export const spriteResourceSpec = {
//   resourceName: PLAYER,
//   animationSpecs,
// };
//
// const positionState = utils.makePositionState({ x: 200, y: 200, z: 1 });
// const accelerationState = utils.makeAccelState({ ax: 0, ay: -9.8 });
// const velocityState = utils.makeVelocityState({ vx: 0, vy: 0 });
//
// // const LEFT_ARROW = 'leftArrow';
// // const RIGHT_ARROW = 'rightArrow';
// // const UP_ARROW = 'upArrow';
// // const DOWN_ARROW = 'downArrow';
//
// const eventMap = {
//   '%': [
//     { action: WALK_L, selector: ANIMATION_CHANGE },
//     { action: { ax: -50 }, selector: ACCELERATION_CHANGE },
//   ],
//   "'": [
//     { action: WALK_R, selector: ANIMATION_CHANGE },
//     { action: { ax: 50 }, selector: ACCELERATION_CHANGE },
//   ],
// };
// // const keyboardInputEventMap = {
// //   '%': LEFT_ARROW,
// //   "'": RIGHT_ARROW,
// //   // '&': UP_ARROW,
// //   // '(': DOWN_ARROW,
// // };
//
// const getSourceSize = (frameName, frameInfo) => frameInfo[frameName].sourceSize;
// const getFrameInfo = (resources, resourceName) => resources[resourceName].spritesheet.data.frames;
//
// const makePlayer = (state: GameState) => {
//   // make pixi animation container for player
//   const currentAnimation = IDLE;
//   const frame = 0;
//
//   const { pixiLoader: { resources }, stage } = getRenderEngine(state);
//   const { animation, nameMap } = makeAnimations(resources, spriteResourceSpec);
//
//   animation.x = positionState.x;
//   animation.y = positionState.y;
//
//   stage.addChild(animation);
//
//   const { resourceName } = spriteResourceSpec;
//   const frameInfo = getFrameInfo(resources, resourceName);
//   const namePath = texturePathByFrame(currentAnimation, resourceName)();
//   const { h, w } = getSourceSize(namePath, frameInfo);
//   // const box = Box(w / 2, h / 2);
//   // const playerRigidBody =
//   //   world
//   //     .createDynamicBody(Vector2D(positionState.x, positionState.y))
//   //     .createFixture(box);
//
//   const player: Entity = {
//     label: PLAYER,
//     id: makeId(ENTITIES),
//     components: [
//       { id: inputControllable.id,
//         state: { inputEventMap: eventMap } },
//       // { id: rigidBody.id,
//       //   state: playerRigidBody },
//       // { id: fixture.id,
//       //   state: undefined },
//       { id: positionable.id,
//         state: positionState },
//       { id: accelerable.id,
//         state: accelerationState },
//       { id: moveable.id,
//         state: velocityState },
//       { id: renderable.id,
//         state: undefined },
//       { id: animateable.id,
//         state: {
//           nameMap,
//           animation,
//           currentAnimation,
//           animationSpecs,
//           frameInfo,
//           tickAccum: 0,
//           frame,
//         } },
//     ],
//   };
//
//   return setState(state, { type: ENTITIES, options: player });
// };
//
// export default makePlayer;
