import React from 'react';

import Positionable from './views/Positionable';
import { default as SpriteRenderable } from './views/SpriteRenderable';
import { default as SquareGraphicRenderable } from './views/SquareGraphicRenderable';
import { default as DisplayContainerable } from './views/DisplayContainerable';

const POSITIONABLE = 'positionable';
const DISPLAY_CONTAINERABLE = 'displayContainerable';
const SPRITE_RENDERABLE = 'spriteRenderable';
const SQUARE_GRAPHIC_RENDERABLE = 'squareGraphicRenderable';

const ComponentView = ({
  component,
  contract,
  componentState,
  updateComponentState,
  contexts,
  entityId,
}) => {
  let ParamComponent;
  switch (component.label) {
    case POSITIONABLE: {
      ParamComponent = Positionable;
      break;
    }

    case DISPLAY_CONTAINERABLE: {
      ParamComponent = DisplayContainerable;
      break;
    }

    case SPRITE_RENDERABLE: {
      ParamComponent = SpriteRenderable;
      break;
    }

    case SQUARE_GRAPHIC_RENDERABLE: {
      ParamComponent = SquareGraphicRenderable;
      break;
    }

    default: {
      ParamComponent = () => <div>type not currently supported</div>;
      break;
    }
  }

  return (
    <div style={{ paddingBottom: '1em' }}>
      <ParamComponent
        entityId={entityId}
        contract={contract}
        contexts={contexts}
        updateComponentState={updateComponentState}
        componentState={componentState}
      />
    </div>
  );
};

export default ComponentView;
