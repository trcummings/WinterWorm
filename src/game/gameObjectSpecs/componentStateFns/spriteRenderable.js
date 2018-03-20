import { makeAnimations, getRenderEngine } from 'Game/engine/pixi';
import { getAssetPathAtlases } from 'Editor/aspects/AssetAtlases';

export default (componentState, context) => (gameState) => {
  const { currentFrame } = componentState;
  const {
    positionable: { x, y },
    spriteable: { resourceName },
  } = context;

  const { [resourceName]: { frameSpecs } } = getAssetPathAtlases();

  // you cannot dispatch actions in the initialization phase

  const { pixiLoader: { resources }, stage } = getRenderEngine(gameState);
  const { animation } = makeAnimations(resources, { resourceName, animationSpecs: frameSpecs });

  animation.x = x;
  animation.y = y;

  stage.addChild(animation);

  return { animation, currentFrame };
};
