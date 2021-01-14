// @flow
import { Matrix } from 'pixi.js';
import { type GameState } from 'Game/engine/types';
import { type PositionableState } from 'Editor/inspector/entityInspector/views/Positionable';
import { type Unit, type Point, getRenderEngine } from 'Game/engine/pixi';
import { type EntityId } from 'Editor/types';

export type Rectangle = {
  x: Unit,
  y: Unit,
  width: Unit,
  height: Unit
};

export const makeRectangle = (
  x: Unit,
  y: Unit,
  w: Unit,
  h: Unit,
): Rectangle => ({ x, y, width: w, height: h });

export type CameraableState = {
  zoom: number,
  rotation: number,
  center: Point,
  pivot: Point,
  transform: Matrix,
  viewport: Rectangle,
  view: Rectangle,
};
// // // camera options
const makeInitialState = ({
  screenWidth,
  screenHeight,
}: { [string]: Unit }): CameraableState => ({
  zoom: 1, // min 0.1
  rotation: 0,
  // position: { x: 0, y: 0 }, // covered by positionable
  center: { x: 0, y: 0 }, // default to screen width / 2
  pivot: { x: 0, y: 0 }, // default to screen width / 2
  view: makeRectangle(0, 0, screenWidth, screenHeight),
  viewport: makeRectangle(0, 0, 0, 0),
  transform: new Matrix(),
});


export default (
  entityId: EntityId,
  componentState: CameraableState,
  context: { positionable: PositionableState },
  gameState: GameState
): [CameraableState, GameState] => {
  const { stage } = getRenderEngine(gameState);
  const { width: screenWidth, height: screenHeight } = stage;

  return [
    makeInitialState({ screenWidth, screenHeight }),
    gameState,
  ];
};
