import React from 'react';

import Positionable from './Positionable';
import { default as Animateable } from './Animateable';

const POSITIONABLE = 'positionable';
const ANIMATEABLE = 'animateable';

const ParamEditor = ({
  component,
  contract,
  componentState,
  updateParam,
}) => {
  let ParamComponent;
  switch (component.label) {
    case POSITIONABLE: {
      ParamComponent = Positionable;
      break;
    }
    case ANIMATEABLE: {
      ParamComponent = Animateable;
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
      updateParam={updateParam}
      componentState={componentState}
    />
  );
};

export default ParamEditor;
