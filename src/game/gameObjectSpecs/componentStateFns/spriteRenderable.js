import { makeAnimations, getRenderEngine, setTransform, addChildMut } from 'Game/engine/pixi';
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

  setTransform(animation, x, y);
  addChildMut(stage, animation);

  return [{ animation, currentAnimation, currentFrame, nameMap }, gameState];
};
