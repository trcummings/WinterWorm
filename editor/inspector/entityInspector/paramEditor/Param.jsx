// @flow
import React from 'react';

import { symbols } from 'Editor/constants';

import PositionParam from './paramTypes/PositionParam';

const Param = ({ param, type, updateParam, componentState }) => {
  const props = { param, componentState, updateParam };
  switch (type) {
    case symbols.POSITION_PARAM: return <PositionParam {...props} />;
    default: return <div>type not currently supported</div>;
  }
};

export default Param;
