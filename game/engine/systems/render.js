// @flow

// system for rendering the PIXI.js stage
import { getRenderEngine } from '../pixi';
import { makeId } from '../util';
import { SYSTEMS, RENDER_ACTION } from '../symbols';
import { getEventsOfEventId } from '../events';

import type { System, GameState } from '../types';

const sortByZIndexHelper = (a, b) => a.position.z - b.position.z;

const RENDER = 'render';

// Renders all the changes to sprites and other Pixi objects.
// Draws sprites in order of their zIndex.
const render: System = {
  label: RENDER,
  id: makeId(SYSTEMS),
  fn: (state: GameState): GameState => {
    const { renderer, stage } = getRenderEngine(state);
    const events = getEventsOfEventId(state, RENDER_ACTION);

    // can't get around these side effects as is the case with PIXI.
    // so, call all the batched render events here to avoid pixi's
    // reference mutation
    for (const event of events) if (event.action) event.action();
    stage.children.sort(sortByZIndexHelper);
    renderer.render(stage);

    return state;
  },
};

export default render;
