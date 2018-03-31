// @flow
import { Graphics } from 'pixi.js';
import { type GameState } from 'Game/engine/types';
import { type EntityId } from 'Editor/types';
import { addChildMut, unitsToPixels } from 'Game/engine/pixi';
import { getCurrentSceneState } from 'Game/engine/ecs';

export default (
  entityId: EntityId,
  componentState,
  context,
  gameState: GameState
): [*, GameState] => {
  const { h, w, color } = componentState;
  const { positionable: { x, y } } = context;

  const { world } = getCurrentSceneState(gameState);

  const shape = new Graphics();

  shape.lineStyle(1, color, 1);
  shape.beginFill(color, 1);
  shape.drawRect(unitsToPixels(x), unitsToPixels(y), unitsToPixels(h), unitsToPixels(w));
  shape.endFill();

  addChildMut(world, shape);

  return [{ h, w, color, shape }, gameState];
};
