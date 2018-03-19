// @flow
import React, { PureComponent } from 'react';
import { assocPath } from 'ramda';


import hofToHoc from 'Editor/aspects/HofToHoc';
import AssetAtlases, {
  type Atlases,
  type ResourceName,
  type AnimName,
} from 'Editor/aspects/AssetAtlases';
import { stateFromContract } from 'Editor/inspector/entityInspector/EntityInspectorContainer';

import FrameSpecs from './FrameSpecs';

type AnimateableState = {
  resourceName: ResourceName,
  animationSpecs: {
    [AnimName]: {

    }
  }
};

type Props = {
  contract: PositionableContract,
  componentState: AnimateableState,
  updateComponentState: AnimateableState => void,
  atlases: Atlases
};

export class Animateable extends PureComponent<Props> {
  props: Props;

  updateFps = (animName: AnimName, newFps: number) => {
    const { updateComponentState, componentState } = this.props;
    const path = ['animationSpecs', animName, 'fps'];
    updateComponentState(assocPath(path, newFps, componentState));
  }

  pickAtlas = key => () => {
    const {
      atlases: { [key]: atlas },
      updateComponentState,
      contract,
    } = this.props;
    const frameSpecs = atlas.frameSpecs;
    const { animationSpecs: fn } = stateFromContract(contract);

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

    updateComponentState(newComponentState);
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

export default hofToHoc(AssetAtlases, 'atlases')(Animateable);
