// @flow

// system for rendering the PIXI.js stage
import { getRenderEngine } from 'Game/engine/pixi';
import { RENDER_ACTION } from 'Game/engine/symbols';
import { getEventsOfEventId } from 'Game/engine/events';

import type { GameState } from 'Types';

const sortByZIndexHelper = (a, b) => a.position.z - b.position.z;

// Renders all the changes to sprites and other Pixi objects.
// Draws sprites in order of their zIndex.
export default (state: GameState): GameState => {
  const { renderer, stage } = getRenderEngine(state);
  const events = getEventsOfEventId(state, RENDER_ACTION);

  // can't get around these side effects as is the case with PIXI.
  // so, call all the batched render events here to avoid pixi's
  // reference mutation
  for (const event of events) if (event.action) event.action();
  stage.children.sort(sortByZIndexHelper);
  renderer.render(stage);

  return state;
};
