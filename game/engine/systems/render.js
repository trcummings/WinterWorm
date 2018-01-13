// @flow

// system for rendering the PIXI.js stage + fpsMeter
import { view, lensProp } from 'ramda';

import { makeId, isDev } from '../util';
import { RENDER_ENGINE, SYSTEMS, RENDER_ACTION } from '../symbols';
import { getEventsOfEventId } from '../events';

import type { System, GameState } from '../types';

const sortByZIndexHelper = (a, b) => a.position.z - b.position.z;

export const getRenderEngine = state => view(lensProp(RENDER_ENGINE), state);

const RENDER = 'render';

// Renders all the changes to sprites and other Pixi objects.
// Draws sprites in order of their zIndex.
const render: System = {
  label: RENDER,
  id: makeId(SYSTEMS),
  fn: (state: GameState): GameState => {
    // // start checking the fps meter frame rate
    if (isDev()) window.meter.tickStart();

    const { renderer, stage } = getRenderEngine(state);
    const events = getEventsOfEventId(state, RENDER_ACTION);

    // can't get around these side effects as is the case with PIXI.
    // so, call all the batched render events here to avoid pixi's
    // reference mutation
    for (const event of events) if (event.action) event.action();
    stage.children.sort(sortByZIndexHelper);
    renderer.render(stage);

    // finish checking the fps meter frame rate
    if (isDev()) window.meter.tick();

    return state;
  },
};

export default render;
