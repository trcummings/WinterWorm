import { setTransform } from 'Game/engine/pixi';
import { RENDER_ACTION } from 'Engine/symbols';
import { makeEvent } from 'Engine/events';
import { drawRectangle } from 'Game/gameObjectSpecs/componentStateFns/squareGraphicRenderable';

const pushToRenderEvents = (renderEvents, fn) => {
  renderEvents.push(makeEvent(fn, [RENDER_ACTION]));
};

export default (entityId, componentState, context) => {
  const {
    positionable: { x, y },
    displayContainerable: { displayContainer: rectangle },
  } = context;
  const { h, w, color } = componentState;
  const events = [];

  pushToRenderEvents(events, () => {
    setTransform(rectangle, x, y);
    drawRectangle({ x, y, h, w, color, rectangle });
  });

  return [componentState, events];
};
