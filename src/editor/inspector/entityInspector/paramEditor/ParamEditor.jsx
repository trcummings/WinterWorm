import React from 'react';

import PositionParam from './paramTypes/PositionParam';
import { default as AnimateableParams } from './paramTypes/AnimateableParams';

const ParamEditor = ({
  component,
  contract,
  componentState,
  updateParam,
}) => {
  let ParamComponent;
  switch (component.label) {
    case 'positionable': {
      ParamComponent = PositionParam;
      break;
    }
    case 'animateable': {
      ParamComponent = AnimateableParams;
      break;
    }
    default: {
      ParamComponent = () => <div>type not currently supported</div>;
      break;
    }
  }

  return (
    <ParamComponent
      param={contract}
      updateParam={updateParam}
      componentState={componentState}
    />
  );
};

export default ParamEditor;
