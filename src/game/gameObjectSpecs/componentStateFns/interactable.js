export const POINTER_UP = 'pointerup';
export const POINTER_DOWN = 'pointerdown';
export const POINTER_UP_OUTSIDE = 'pointerupoutside';
export const POINTER_OVER = 'pointerover';
export const POINTER_MOVE = 'pointermove';
export const POINTER_OUT = 'pointerout';

const INITIAL_STATE = {
  over: false,
  touching: false,
  data: null,
};

export default (entityId, componentState, context, gameState) => {
  console.log(entityId, componentState, context, gameState);
  const {
    spriteRenderable: { animation, currentAnimation, currentFrame, nameMap },
  } = context;

  const animIndex = nameMap[currentAnimation];
  const sprites = animation.children[animIndex];
  const sprite = sprites.children[currentFrame];

  sprite.buttonMode = true;
  sprite.interactive = true;

  sprite
    .on(POINTER_UP)
    .on(POINTER_DOWN)
    .on(POINTER_UP_OUTSIDE)
    .on(POINTER_OVER)
    .on(POINTER_MOVE)
    .on(POINTER_OUT);

  // animation.x = x;
  // animation.y = y;

  // stage.addChild(animation);

  return { initialComponentState: INITIAL_STATE, nextGameState: gameState };
};
