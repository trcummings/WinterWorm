import { OutlineFilter } from '@pixi/filter-outline';

import { RENDER_ACTION } from 'Engine/symbols';
import { makeEvent } from 'Engine/events';

import { getCurrentSprite } from './spriteRenderable';

const BLUE = 0x87CEFA;
const GREEN = 0x99ff99;
const RED = 0xff9999;

const makeColorFilter = color => new OutlineFilter(2, color);

const redFilter = makeColorFilter(RED);
const greenFilter = makeColorFilter(GREEN);
const blueFilter = makeColorFilter(BLUE);

export default (entityId, componentState, context) => {
  const {
    interactable,
    spriteRenderable,
    displayContainerable: { displayContainer: animation },
  } = context;
  const sprite = getCurrentSprite({ ...spriteRenderable, animation });
  const { touching, over, selected } = interactable;
  let setFiltersTo = null;

  if (over && !touching) setFiltersTo = [blueFilter];
  else if (touching) setFiltersTo = [greenFilter];
  else if (!over && !touching && selected) setFiltersTo = [redFilter];
  const filterEvent = makeEvent(() => {
    sprite.filters = setFiltersTo;
  }, [RENDER_ACTION]);

  return [componentState, [filterEvent]];
};
