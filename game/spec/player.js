import path from 'path';

import { makeId } from '../engine/util';
import { position, animateable, renderable, utils } from '../engine/components';
import { ENTITIES } from '../engine/symbols';
import { setState } from '../engine/core';
import { makeAnimations, getRenderEngine } from '../engine/pixi';

const PLAYER = 'player';

const CLIMB = 'climb';
const DUCK_L = 'duck_l';
const DUCK_R = 'duck_r';
const HURT_L = 'hurt_l';
const HURT_R = 'hurt_r';
const IDLE = 'idle';
const JUMP_L = 'jump_l';
const JUMP_R = 'jump_r';
const STAND_L = 'stand_l';
const STAND_R = 'stand_r';
const SWIM_L = 'swim_l';
const SWIM_R = 'swim_r';
const WALK_L = 'walk_l';
const WALK_R = 'walk_r';

export const animationLoaderSpec = {
  name: PLAYER,
  path: path.resolve(process.env.ASSET_PATH, './player/player.json'),
};

const animationSpecs = {
  [CLIMB]: { animName: CLIMB,   numFrames: 2, fps: 6 },
  [DUCK_L]: { animName: DUCK_L,  numFrames: 1, fps: 6 },
  [DUCK_R]: { animName: DUCK_R,  numFrames: 1, fps: 6 },
  [HURT_L]: { animName: HURT_L,  numFrames: 1, fps: 6 },
  [HURT_R]: { animName: HURT_R,  numFrames: 1, fps: 6 },
  [IDLE]: { animName: IDLE,    numFrames: 1, fps: 6 },
  [JUMP_L]: { animName: JUMP_L,  numFrames: 1, fps: 6 },
  [JUMP_R]: { animName: JUMP_R,  numFrames: 1, fps: 6 },
  [STAND_L]: { animName: STAND_L, numFrames: 1, fps: 6 },
  [STAND_R]: { animName: STAND_R, numFrames: 1, fps: 6 },
  [SWIM_L]: { animName: SWIM_L,  numFrames: 2, fps: 6 },
  [SWIM_R]: { animName: SWIM_R,  numFrames: 2, fps: 6 },
  [WALK_L]: { animName: WALK_L,  numFrames: 2, fps: 6 },
  [WALK_R]: { animName: WALK_R,  numFrames: 2, fps: 6 },
};

export const spriteResourceSpec = {
  resourceName: PLAYER,
  animationSpecs,
};

const positionState = utils.setPositionState({ x: 200, y: 200, z: 1 });
// const boundRectState = ({ height: 50, width: 50, lineWidth: 1, lineColor: 0xFF00FF });

const makePlayer = (state) => {
  const playerId = makeId(ENTITIES);
  const { pixiLoader: { resources }, stage } = getRenderEngine(state);
  const { animation, nameMap } = makeAnimations(resources, spriteResourceSpec);

  animation.x = positionState.x;
  animation.y = positionState.y;

  stage.addChild(animation);

  const player = {
    id: playerId,
    components: [
      { id: position.id, state: positionState },
      { id: animateable.id,
        state: {
          nameMap,
          animation,
          currentAnimation: SWIM_R,
          animationSpecs,
          tickAccum: 0,
          frame: 0,
        } },
      { id: renderable.id, state: undefined },
    ],
  };
  return setState(state, { type: ENTITIES, options: player });
};

export default makePlayer;
