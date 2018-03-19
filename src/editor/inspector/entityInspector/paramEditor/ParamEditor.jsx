import React from 'react';

import Positionable from './Positionable';
// import { default as Animateable } from './Animateable';
import { default as Spriteable } from './Spriteable';

const POSITIONABLE = 'positionable';
const SPRITEABLE = 'spriteable';
// const ANIMATEABLE = 'animateable';

const ParamEditor = ({
  component,
  contract,
  componentState,
  updateComponentState,
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

    default: {
      ParamComponent = () => <div>type not currently supported</div>;
      break;
    }
  }

  return (
    <ParamComponent
      contract={contract}
      updateComponentState={updateComponentState}
      componentState={componentState}
    />
  );
};

export default ParamEditor;
