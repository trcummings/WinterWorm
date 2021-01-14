// @flow
import uuidv4 from 'uuid/v4';
import { POSITION_CHANGE } from 'Game/ecsModules/eventTypes';
import { getInboxEvents } from 'Game/engine/events';
import { pixelsToUnits } from 'Game/engine/pixi';

import { type EntityId } from 'Editor/types';
import { type Position } from 'Editor/inspector/entityInspector/views/Positionable';

export const POSITON = 'position';

const INITIAL_OFFSET = {
  offsetX: pixelsToUnits(0),
  offsetY: pixelsToUnits(0),
};

const updateOffset = (
  { offsetX: totalX, offsetY: totalY },
  { action: { offsetX: xO, offsetY: yO } }
) => ({ offsetX: totalX + xO, offsetY: totalY + yO });

export default {
  id: uuidv4(),
  label: POSITON,
  subscriptions: [POSITION_CHANGE],
  contract: {
    x: {
      type: 'number',
      defaultsTo: 0,
    },
    y: {
      type: 'number',
      defaultsTo: 0,
    },
  },
  fn: (
    entityId: EntityId,
    componentState: Position,
    context = {}
  ): [Position, Events] => {
    const events = getInboxEvents(POSITION_CHANGE)(context.inbox);

    if (events.length === 0) return componentState;

    const { x, y } = componentState;
    const { offsetX, offsetY } = events.reduce(updateOffset, INITIAL_OFFSET);

    return [{ x: x + offsetX, y: y - offsetY }];
  },
};
