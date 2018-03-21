import { addInteraction } from 'Game/gameObjectSpecs/systemFns/pixiInteraction';

export const POINTER_UP = 'pointerup';
export const POINTER_DOWN = 'pointerdown';
export const POINTER_UP_OUTSIDE = 'pointerupoutside';
export const POINTER_OVER = 'pointerover';
export const POINTER_MOVE = 'pointermove';
export const POINTER_OUT = 'pointerout';

const INITIAL_STATE = {
  over: false,
  touching: false,
};

export default (entityId, componentState, context, gameState) => {
  const {
    spriteRenderable: { animation, currentAnimation, currentFrame, nameMap },
  } = context;

  const animIndex = nameMap[currentAnimation];
  const sprites = animation.children[animIndex];
  const sprite = sprites.children[currentFrame];

  return {
    initialComponentState: INITIAL_STATE,
    nextGameState: addInteraction(gameState, entityId, sprite),
  };
};
