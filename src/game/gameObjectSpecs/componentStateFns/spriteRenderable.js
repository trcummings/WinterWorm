import { makeAnimations, getRenderEngine } from 'Game/engine/pixi';
import { getAssetPathAtlases } from 'Editor/aspects/AssetAtlases';

export default (componentState, context) => (gameState) => {
  const { currentFrame } = componentState;
  const {
    positionable: { x, y },
    spriteable: { resourceName },
  } = context;

  const { [resourceName]: { frameSpecs } } = getAssetPathAtlases();
  const animationResourceSpec = { resourceName, animationSpecs: frameSpecs };
  const { pixiLoader: { resources }, stage } = getRenderEngine(gameState);
  const { animation, nameMap } = makeAnimations(resources, animationResourceSpec);

  animation.x = x;
  animation.y = y;

  stage.addChild(animation);

  const animIndex = nameMap[currentFrame];
  const sprites = animation.children[animIndex];
  sprites.renderable = true;

  return { animation, currentFrame, nameMap };
  // you cannot dispatch actions in the initialization phase
};
