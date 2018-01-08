// @flow

// system for rendering the PIXI.js stage + fpsMeter
import { view, lensProp } from 'ramda';

import { renderMut } from '../pixi';
import { makeId, isDev } from '../util';
import { RENDER_ENGINE, SYSTEMS } from '../symbols';
import type { System, GameState } from '../types';

const sortByZIndexHelper = (a, b) => a.position.z - b.position.z;

export const getRenderEngine = state => view(lensProp(RENDER_ENGINE), state);

// Renders all the changes to sprites and other Pixi objects.
// Draws sprites in order of their zIndex.
const render: System = {
  id: makeId(SYSTEMS),
  fn: (state: GameState): GameState => {
    const { renderer, stage } = getRenderEngine(state);

    // // start checking the fps meter frame rate
    if (isDev()) window.meter.tickStart();

    // can't get around these side effects as is the case with PIXI.
    stage.children.sort(sortByZIndexHelper);
    renderMut(renderer, stage);

    // finish checking the fps meter frame rate
    if (isDev()) window.meter.tick();

    return state;
  },
};

export default render;
