// @flow
import { makeId } from '../util';
// import { getComponentState } from '../ecs';
// import { removeChildMut, addChildMut } from '../pixi';
// import { getRenderEngine } from '../systems/render';
import { COMPONENTS } from '../symbols';

import { position as positionC } from './position';
import { boundingRect as boundingRectC } from './boundingRect';

import type { Component } from '../types';

const renderableRectId = makeId(COMPONENTS);

// Removes shape from the stage belonging to the entity and returns state.
const cleanupShapeState = (state, entityId) =>
  // const stage = getRenderEngine(state).stage;
  // const graphics = getComponentState(state, renderableRectId, entityId);
  //
  // removeChildMut(stage, graphics);
  // console.log(entityId);
  state
;

// Update the screen x, y position of the sprite based on any move events
// from a component inbox. Returns the updated sprite.
// const setPositionMut = (shape, position) => {
//   console.log(position);
//   // (defn set-position!
//   //   ""
//   //   [sprite position]
//   //   (let [{:keys [screen-x screen-y screen-z]} position]
//   //     ;; Mutate the x and y position of the sprite if there was any
//   //     ;; move changes
//   //     (aset sprite "position" (js-obj "x" screen-x "y" screen-y "z" screen-z))))
// };

// const setShapeState = componentId => (state, entityId) => {
//   const stage = getRenderEngine(state).stage;
//   const graphics = getComponentState(state, componentId, entityId);
//
//   graphics.lineStyle(lineWidth, lineColor);
//   graphics.drawRect(x, y, height, width);
//   graphics.endFill();
//
//
//   addChildMut(stage, graphics);
//
//   return state;
// };

// Renders the sprite in relation to the position of the entity and
// frame of the spritesheet deterimined by the animateable state
const renderShape = (entityId, componentState, context) =>
  // if (!componentState) {
  //
  // }
  // const graphics = componentState;
  // const { [positionC.id]: position, [boundingRectC.id]: boundingRect } = context;
  // const { height, width, lineWidth, lineColor } = boundingRect;
  // const { x, y } = position;

  // graphics.lineStyle(lineWidth, lineColor);
  // graphics.drawRect(x, y, height, width);
  // graphics.endFill();
  // console.log(componentState, context);
  componentState
;

const renderableRect: Component = {
  id: renderableRectId,
  fn: renderShape,
  cleanupFn: cleanupShapeState,
  context: [positionC.id, boundingRectC.id],
};

export { renderableRect };
