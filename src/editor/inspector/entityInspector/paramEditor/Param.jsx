//
import React from 'react';

import { symbols } from 'Editor/constants';

import PositionParam from './paramTypes/PositionParam';
import AnimateableParams from './paramTypes/AnimateableParams';

const Param = ({ type, ...rest }) => {
  switch (type) {
    case symbols.POSITION_PARAM: return <PositionParam {...rest} />;
    case symbols.ANIMATEABLE_PARAM: return <AnimateableParams {...rest} />;
    default: return <div>type not currently supported</div>;
  }
};

export default Param;
