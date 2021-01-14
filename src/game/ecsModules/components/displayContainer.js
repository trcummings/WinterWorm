// @flow
import uuidv4 from 'uuid/v4';
import { Container, Graphics } from 'pixi.js';
import { type GameState } from 'Game/engine/types';
import { type EntityId } from 'Editor/types';
import { addChildMut } from 'Game/engine/pixi';
import { getCurrentSceneState } from 'Game/engine/ecs';

const GRAPHICS = 'graphics';
const SPRITE = 'sprite';

const DISPLAY_CONTAINER = 'displayContainer';

export default {
  id: uuidv4(),
  label: DISPLAY_CONTAINER,
  contract: {
    displayType: {
      in: [
        'graphics',
        'sprite',
      ],
    },
  },
  stateFn: (
    entityId: EntityId,
    componentState,
    context,
    gameState: GameState
  ): [*, GameState] => {
    const { displayType } = componentState;
    const { world } = getCurrentSceneState(gameState);

    let Constructor;
    switch (displayType) {
      case SPRITE: {
        Constructor = Container;
        break;
      }
      case GRAPHICS: {
        Constructor = Graphics;
        break;
      }
      default: {
        Constructor = Container;
        break;
      }
    }

    const displayContainer = new Constructor();
    addChildMut(world, displayContainer);

    return [{ displayType, displayContainer }, gameState];
  },
  fn: (entityId, componentState) => componentState,
};
