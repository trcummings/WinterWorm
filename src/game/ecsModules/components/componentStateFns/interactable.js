import { addInteraction } from 'Game/gameObjectSpecs/systemFns/pixiInteraction';

export const POINTER_UP = 'pointerup';
export const POINTER_DOWN = 'pointerdown';
export const POINTER_UP_OUTSIDE = 'pointerupoutside';
export const POINTER_OVER = 'pointerover';
export const POINTER_MOVE = 'pointermove';
export const POINTER_OUT = 'pointerout';
export const SELECT_ENTITY = 'selectEntity';

const INITIAL_STATE = {
  over: false,
  touching: false,
  selected: false,
  data: null,
};

export default (entityId, componentState, context, gameState) => {
  const {
    displayContainerable: { displayContainer: animation },
    // spriteRenderable: { currentAnimation, currentFrame, nameMap },
  } = context;

  // const animIndex = nameMap[currentAnimation];
  // const sprites = animation.children[animIndex];
  // const sprite = sprites.children[currentFrame];

  return [INITIAL_STATE, addInteraction(gameState, entityId, animation)];
};
