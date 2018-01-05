// @flow
import { makeId } from '../util';
import { getComponentState } from '../ecs';
import { removeChildMut } from '../pixi';
import { getRenderEngine } from '../systems/render';
import { COMPONENTS } from '../symbols';

import type { Component } from '../types';

// Removes shape from the stage belonging to the entity and returns state.
const cleanupShapeState = (state, entityId) => {
  const stage = getRenderEngine(state).stage;
  const componentState = getComponentState(state, entityId);
  const graphics = componentState.graphics;

  removeChildMut(stage, graphics);

  return state;
};

// Update the screen x, y position of the sprite based on any move events
// from a component inbox. Returns the updated sprite.
const setPositionMut = (shape, position) => {
  // (defn set-position!
  //   ""
  //   [sprite position]
  //   (let [{:keys [screen-x screen-y screen-z]} position]
  //     ;; Mutate the x and y position of the sprite if there was any
  //     ;; move changes
  //     (aset sprite "position" (js-obj "x" screen-x "y" screen-y "z" screen-z))))
};

const setShapeState = (stage) => {

};

// Renders the sprite in relation to the position of the entity and
// frame of the spritesheet deterimined by the animateable state
const renderShape = (entityId, componentState, context) => {
  const { position } = context;
  const { graphics } = componentState;

  setPositionMut(graphics, position);
};

const renderableRect: Component = {
  id: makeId(COMPONENTS),
  fn: renderShape,
  cleanupFn: cleanupShapeState,
};

export { renderableRect };
