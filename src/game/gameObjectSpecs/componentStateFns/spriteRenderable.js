import { makeAnimations, getRenderEngine, setTransform } from 'Game/engine/pixi';
import { getAssetPathAtlases } from 'Editor/aspects/AssetAtlases';

export default (entityId, componentState, context, gameState) => {
  const { currentAnimation, currentFrame, resourceName } = componentState;
  const {
    positionable: { x, y },
    displayContainerable: { displayContainer: animation },
  } = context;

  const { [resourceName]: { frameSpecs } } = getAssetPathAtlases();
  const animationResourceSpec = { resourceName, animationSpecs: frameSpecs };
  const { pixiLoader: { resources } } = getRenderEngine(gameState);
  const { nameMap } = makeAnimations(animation, resources, animationResourceSpec);

  const animIndex = nameMap[currentAnimation];
  const sprites = animation.children[animIndex];

  sprites.renderable = true;
  sprites.children[currentFrame].renderable = true;

  setTransform(animation, x, y);

  return [{ ...componentState, nameMap }, gameState];
};
