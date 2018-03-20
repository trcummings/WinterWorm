// @flow
import React, { PureComponent } from 'react';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

import hofToHoc from 'Editor/aspects/HofToHoc';
import AssetAtlases, {
  type Atlases,
  type AnimName,
} from 'Editor/aspects/AssetAtlases';
import type { Component, ComponentState } from 'Editor/types';

type SpriteRenderableState = {
  currentAnimation: AnimName,
  currentFrame: number,
};

type Props = {
  componentState: SpriteRenderableState,
  updateComponentState: SpriteRenderableState => void,
  atlases: Atlases,
  contexts: {
    [$PropertyType<Component, 'label'>]: $PropertyType<ComponentState, 'state'>
  }
};

class SpriteRenderable extends PureComponent<Props> {
  props: Props;

  handleChange =
    (key: $Keys<SpriteRenderableState>) =>
      (event: SyntheticEvent<HTMLSelectElement | HTMLInputElement>): void => (
        this.props.updateComponentState({
          ...this.props.componentState,
          [key]: (
            typeof event.currentTarget.value === 'number'
              ? parseInt(event.currentTarget.value, 10)
              : event.currentTarget.value
          ),
        }))

  render() {
    const {
      contexts: { spriteable: { resourceName } = {} } = {},
      atlases: { [resourceName]: { frameSpecs = {} } = {} },
      componentState: { currentAnimation, currentFrame },
    } = this.props;

    return (
      <div>
        <select
          value={currentAnimation}
          onChange={this.handleChange('currentAnimation')}
        >
          <option value="">Select Current Sprite</option>
          { Object.keys(frameSpecs).map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
        <FormControl>
          <InputLabel htmlFor="currentFrame">Current Frame</InputLabel>
          <Input
            onChange={this.handleChange('currentFrame')}
            value={currentFrame}
            id="currentFrame"
            type="number"
          />
        </FormControl>
      </div>
    );
  }
}

export default hofToHoc(AssetAtlases, 'atlases')(SpriteRenderable);
