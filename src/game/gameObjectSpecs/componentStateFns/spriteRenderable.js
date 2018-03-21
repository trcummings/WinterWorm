import { makeAnimations, getRenderEngine } from 'Game/engine/pixi';
import { getAssetPathAtlases } from 'Editor/aspects/AssetAtlases';

export default (entityId, componentState, context, gameState) => {
  const { currentAnimation, currentFrame } = componentState;
  const {
    positionable: { x, y },
    spriteable: { resourceName },
  } = context;

  const { [resourceName]: { frameSpecs } } = getAssetPathAtlases();
  const animationResourceSpec = { resourceName, animationSpecs: frameSpecs };
  const { pixiLoader: { resources }, stage } = getRenderEngine(gameState);
  const { animation, nameMap } = makeAnimations(resources, animationResourceSpec);

  const animIndex = nameMap[currentAnimation];
  const sprites = animation.children[animIndex];

  sprites.renderable = true;
  sprites.children[currentFrame].renderable = true;

  animation.x = x;
  animation.y = y;

  stage.addChild(animation);

  return {
    initialComponentState: { animation, currentAnimation, currentFrame, nameMap },
    nextGameState: gameState,
  };
};
