import React, { Fragment } from 'react';

import TextField from 'material-ui/TextField';

const FrameSpecs = ({ specs, updateFps }) => (
  <Fragment>
    { Object.keys(specs).map(animName => (
      <div key={animName}>
        <div>
          <div>
            { `Animation Name: ${animName}`}
          </div>
          <div>
            { `Number of Frames: ${specs[animName].numFrames}`}
          </div>
        </div>
        <TextField
          value={specs[animName].fps}
          onChange={(_, val) => updateFps(animName, val)}
          floatingLabelText="FPS"
          type="number"
        />
      </div>
    )) }
  </Fragment>
);

export default FrameSpecs;
