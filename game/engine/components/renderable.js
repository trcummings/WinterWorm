// @flow
import { makeId } from '../util';
import { COMPONENTS } from '../symbols';

import { positionable } from './positionable';
import { animateable } from './animateable';

import type { Component } from '../types';

const RENDERABLE = 'renderable';

const renderable: Component = {
  label: RENDERABLE,
  id: makeId(COMPONENTS),
  context: [positionable.id, animateable.id],
  fn: (entityId, componentState, context) => {
    const { [positionable.id]: { x, y }, [animateable.id]: { animation } } = context;

    animation.setTransform(x, y);

    return componentState;
  },
};

export { renderable };
