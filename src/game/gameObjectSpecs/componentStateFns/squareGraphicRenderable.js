// @flow
import { Graphics } from 'pixi.js';
import { type GameState } from 'Game/engine/types';
import { type EntityId } from 'Editor/types';
import { addChildMut, unitsToPixels } from 'Game/engine/pixi';
import { getCurrentSceneState } from 'Game/engine/ecs';

export const drawRectangle = ({ x, y, w, h, color, rectangle }) => {
  rectangle.clear();
  rectangle.lineStyle(1, color, 1);
  rectangle.beginFill(color, 1);
  rectangle.drawRect(
    unitsToPixels(x),
    unitsToPixels(y),
    unitsToPixels(w),
    unitsToPixels(h)
  );
  rectangle.endFill();

  return rectangle;
};

export default (
  entityId: EntityId,
  componentState,
  context,
  gameState: GameState
): [*, GameState] => {
  const { h, w, color } = componentState;
  const { positionable: { x, y } } = context;

  const { world } = getCurrentSceneState(gameState);

  const rectangle = new Graphics();

  drawRectangle({ x, y, h, w, color, rectangle });
  addChildMut(world, rectangle);

  return [{ h, w, color, rectangle }, gameState];
};
