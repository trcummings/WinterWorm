import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { assocPath } from 'ramda';

import TextField from 'material-ui/TextField';

import hofToHoc from 'Editor/aspects/HofToHoc';
import AssetAtlases from 'Editor/aspects/AssetAtlases';
import { stateFromContract } from 'Editor/inspector/entityInspector/EntityInspectorContainer';

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

export class AnimateableParams extends PureComponent {
  static propTypes = {
    param: PropTypes.object.isRequired,
    componentState: PropTypes.object,
    updateParam: PropTypes.func.isRequired,
  }

  updateFps = (animName, newFps) => {
    const { updateParam, componentState } = this.props;
    const path = ['animationSpecs', animName, 'fps'];
    updateParam(assocPath(path, newFps, componentState));
  }

  pickAtlas = key => () => {
    const {
      atlases: { [key]: atlas },
      updateParam,
      param,
    } = this.props;
    const frameSpecs = atlas.frameSpecs;
    const { animationSpecs: fn } = stateFromContract(param);

    const newComponentState = {
      resourceName: key,
      animationSpecs: Object.keys(frameSpecs).reduce((total, animName) => (
        Object.assign(total, {
          [animName]: {
            ...fn(),
            ...frameSpecs[animName],
          },
        })
      ), {}),
    };

    updateParam(newComponentState);
  }

  render() {
    const { atlases, componentState: { resourceName, animationSpecs } } = this.props;
    const value = resourceName || 1;

    return (
      <div>
        <select value={value}>
          <option value="">Select Asset Atlas</option>
          { Object.keys(atlases).map(key => (
            <option
              key={key}
              value={key}
              onSelect={this.pickAtlas(key)}
            >{key}</option>
          ))}
        </select>
        { value !== 1 && (
          <FrameSpecs
            updateFps={this.updateFps}
            specs={animationSpecs}
          />
        ) }
      </div>
    );
  }
}

export default hofToHoc(AssetAtlases)(AnimateableParams);
