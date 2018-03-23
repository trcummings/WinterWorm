import React from 'react';

import Positionable from './Positionable';
import { default as Spriteable } from './Spriteable';
import { default as SpriteRenderable } from './SpriteRenderable';

const POSITIONABLE = 'positionable';
const SPRITEABLE = 'spriteable';
const SPRITE_RENDERABLE = 'spriteRenderable';

const ParamEditor = ({
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

    case SPRITEABLE: {
      ParamComponent = Spriteable;
      break;
    }

    case SPRITE_RENDERABLE: {
      ParamComponent = SpriteRenderable;
      break;
    }

    default: {
      ParamComponent = () => <div>type not currently supported</div>;
      break;
    }
  }

  return (
    <ParamComponent
      entityId={entityId}
      contract={contract}
      contexts={contexts}
      updateComponentState={updateComponentState}
      componentState={componentState}
    />
  );
};

export default ParamEditor;
