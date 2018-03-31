// @flow

// system for rendering the PIXI.js stage
import { getRenderEngine, getCurrentCamera } from 'Game/engine/pixi';
import { getCurrentSceneState } from 'Game/engine/ecs';
import { RENDER_ACTION } from 'Game/engine/symbols';
import { getEventsOfEventId } from 'Game/engine/events';

import type { GameState } from 'Types';

const sortByZIndexHelper = (a, b) => a.position.z - b.position.z;

const updateWorldTransform = (state: GameState) => {
  const camera = getCurrentCamera(state);
  const { world } = getCurrentSceneState(state);
  const ct = camera.transform;
  const wt = world.worldTransform;

  // lets do the fast version as we know there is no rotation..
  const a  = world.scale.x;
  const d  = world.scale.y;
  const tx = world.position.x - (world.pivot.x * world.scale.x);
  const ty = world.position.y - (world.pivot.y * world.scale.y);

  wt.a  = a  * ct.a; // eslint-disable-line
  wt.b  = a  * ct.b; // eslint-disable-line
  wt.c  = d  * ct.c; // eslint-disable-line
  wt.d  = d  * ct.d; // eslint-disable-line
  wt.tx = (tx * ct.a) + (ty * ct.c) + ct.tx; // eslint-disable-line
  wt.ty = (tx * ct.b) + (ty * ct.d) + ct.ty; // eslint-disable-line

  for (const child of world.children) child.updateTransform();
  return state;
};

// Renders all the changes to sprites and other Pixi objects.
// Draws sprites in order of their zIndex.
export default (state: GameState): GameState => {
  const next = updateWorldTransform(state);

  const { renderer, stage } = getRenderEngine(next);
  const events = getEventsOfEventId(next, RENDER_ACTION);

  // can't get around these side effects as is the case with PIXI.
  // so, call all the batched render events here to avoid pixi's
  // reference mutation
  for (const event of events) if (event.action) event.action();
  stage.children.sort(sortByZIndexHelper);
  renderer.render(stage);

  return next;
};
