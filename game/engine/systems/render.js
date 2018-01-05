// @flow

// System for rendering entities through PIXI.js
import { view, lensProp } from 'ramda';

import { renderMut } from '../pixi';
import { makeId } from '../util';
import { RENDER_ENGINE } from '../symbols';
import type { System, GameState } from '../types';

const sortByZIndexHelper = (a, b) => a.position.z - b.position.z;

// Renders all the changes to sprites and other Pixi objects.
// Draws sprites in order of their zIndex.
const render: System = {
  id: makeId(),
  fn: (state: GameState): GameState => {
    const { renderer, stage } = view(lensProp(RENDER_ENGINE), state);

    // // start checking the fps meter frame rate
    window.meter.tickStart();

    // can't get around these side effects as is the case with PIXI.
    stage.children.sort(sortByZIndexHelper);
    renderMut(renderer, stage);

    // finish checking the fps meter frame rate
    window.meter.tick();

    return state;
  },
};

export default render;
