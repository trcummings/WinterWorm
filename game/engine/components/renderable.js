// @flow
import { makeId } from '../util';
import { COMPONENTS } from '../symbols';

import { position } from './position';
import { animateable } from './animateable';

import type { Component } from '../types';

const RENDERABLE = 'renderable';

const renderable: Component = {
  label: RENDERABLE,
  id: makeId(COMPONENTS),
  fn: (entityId, componentState, context) => {
    const { [position.id]: { x, y }, [animateable.id]: { animation } } = context;

    // animation.setTransform(x, y);

    return componentState;
  },
  context: [position.id, animateable.id],
};

export { renderable };
