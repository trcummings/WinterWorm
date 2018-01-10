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

const makeAnimSpec = (animName, numFrames) => ({ animName, numFrames });

export const spriteResourceSpec = {
  resourceName: PLAYER,
  animationSpecs: [
    makeAnimSpec(CLIMB, 2),
    makeAnimSpec(DUCK_L, 1),
    makeAnimSpec(DUCK_R, 1),
    makeAnimSpec(HURT_L, 1),
    makeAnimSpec(HURT_R, 1),
    makeAnimSpec(IDLE, 1),
    makeAnimSpec(JUMP_L, 1),
    makeAnimSpec(JUMP_R, 1),
    makeAnimSpec(STAND_L, 1),
    makeAnimSpec(STAND_R, 1),
    makeAnimSpec(SWIM_L, 2),
    makeAnimSpec(SWIM_R, 2),
    makeAnimSpec(WALK_L, 2),
    makeAnimSpec(WALK_R, 2),
  ] };

const positionState = utils.setPositionState({ x: 200, y: 200, z: 1 });
// const boundRectState = ({ height: 50, width: 50, lineWidth: 1, lineColor: 0xFF00FF });

const makePlayer = (state) => {
  const playerId = makeId(ENTITIES);
  const { pixiLoader: { resources }, stage } = getRenderEngine(state);
  const { indexMap, nameMap, animation } = makeAnimations(resources, spriteResourceSpec);

  animation.x = positionState.x;
  animation.y = positionState.y;
  stage.addChild(animation);

  const player = {
    id: playerId,
    components: [
      { id: position.id, state: positionState },
      { id: animateable.id,
        state: {
          indexMap,
          nameMap,
          animation,
          currentAnimation: SWIM_R,
          frame: 0,
        } },
      { id: renderable.id, state: undefined },
    ],
  };
  return setState(state, { type: ENTITIES, options: player });
};

export default makePlayer;
