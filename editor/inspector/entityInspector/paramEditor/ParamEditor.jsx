// 
import React from 'react';
import { Card } from 'material-ui/Card';

import Param from './Param';

const ParamEditor = ({
  contract: { id, param, type, label, children },
  componentState,
  parameters,
  updateParam,
}) => (
  <Card>
    { label }
    <div>
      <Param
        type={type}
        param={param}
        updateParam={updateParam}
        componentState={componentState}
      />
    </div>
    <div>
      { children.map(pId => (
        <ParamEditor
          key={pId}
          updateParam={updateParam}
          contract{...parameters[id]}
          componentState={componentState}
        />
      )) }
    </div>
  </Card>
);

export default ParamEditor;
