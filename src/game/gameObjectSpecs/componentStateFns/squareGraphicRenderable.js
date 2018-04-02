// @flow
import { Rectangle } from 'pixi.js';
import { type GameState } from 'Game/engine/types';
import { type EntityId } from 'Editor/types';
import { unitsToPixels } from 'Game/engine/pixi';

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
  const {
    positionable: { x, y },
    displayContainerable: { displayContainer: rectangle },
  } = context;

  drawRectangle({ x, y, h, w, color, rectangle });

  return [{ h, w, color }, gameState];
};
