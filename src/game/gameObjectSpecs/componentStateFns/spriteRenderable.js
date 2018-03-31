import { makeAnimations, getRenderEngine, setTransform, addChildMut } from 'Game/engine/pixi';
import { getAssetPathAtlases } from 'Editor/aspects/AssetAtlases';
import { getCurrentSceneState } from 'Game/engine/ecs';

export default (entityId, componentState, context, gameState) => {
  const { currentAnimation, currentFrame } = componentState;
  const {
    positionable: { x, y },
    spriteable: { resourceName },
  } = context;

  const { [resourceName]: { frameSpecs } } = getAssetPathAtlases();
  const animationResourceSpec = { resourceName, animationSpecs: frameSpecs };
  const { pixiLoader: { resources } } = getRenderEngine(gameState);
  const { world } = getCurrentSceneState(gameState);
  const { animation, nameMap } = makeAnimations(resources, animationResourceSpec);
  // const world = getSceneWorld(gameState);

  const animIndex = nameMap[currentAnimation];
  const sprites = animation.children[animIndex];

  sprites.renderable = true;
  sprites.children[currentFrame].renderable = true;

  setTransform(animation, x, y);
  addChildMut(world, animation);

  return [{ animation, currentAnimation, currentFrame, nameMap }, gameState];
};
