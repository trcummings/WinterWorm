// 
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { assocPath } from 'ramda';

import hofToHoc from 'Editor/aspects/HofToHoc';
import AssetAtlases from 'Editor/aspects/AssetAtlases';

import { stateFromContract } from '../../EntityInspectorContainer';

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
        <DropDownMenu value={value}>
          <MenuItem value={1} primaryText="Select Asset Atlas" />
          { Object.keys(atlases).map(key => (
            <MenuItem
              key={key}
              value={key}
              primaryText={key}
              onClick={this.pickAtlas(key)}
            />
          ))}
        </DropDownMenu>
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
