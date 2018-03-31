// @flow
import React, { PureComponent } from 'react';

import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

import { ANIMATION_CHANGE, FRAME_CHANGE } from 'Game/engine/symbols';
import { emitQueueEvent } from 'Editor/ipcUtil';

import hofToHoc from 'Editor/aspects/HofToHoc';
import AssetAtlases, {
  type Atlases,
  type AnimName,
} from 'Editor/aspects/AssetAtlases';
import type { Component, ComponentState, EntityId } from 'Editor/types';

type SpriteRenderableState = {
  currentAnimation: AnimName,
  currentFrame: number,
};

type Props = {
  entityId: EntityId,
  componentState: SpriteRenderableState,
  updateComponentState: SpriteRenderableState => void,
  atlases: Atlases,
  contexts: {
    [$PropertyType<Component, 'label'>]: $PropertyType<ComponentState, 'state'>
  }
};

class SpriteRenderable extends PureComponent<Props> {
  props: Props;

  handleAnimationChange = (event: SyntheticEvent<HTMLSelectElement>): void => {
    const { componentState, updateComponentState, entityId } = this.props;
    const currentAnimation = event.currentTarget.value;
    const currentFrame = 0;

    updateComponentState({ ...componentState, currentAnimation, currentFrame })
      .then(() => emitQueueEvent(currentAnimation, [ANIMATION_CHANGE, entityId]));
  }

  handleFrameChange = (event: SyntheticEvent<HTMLInputElement>): void => {
    const { componentState, updateComponentState, entityId } = this.props;
    const currentFrame = parseInt(event.currentTarget.value, 10);

    updateComponentState({ ...componentState, currentFrame })
      .then(() => emitQueueEvent(currentFrame, [FRAME_CHANGE, entityId]));
  }

  render() {
    const {
      contexts: { spriteable: { resourceName } = {} } = {},
      atlases: { [resourceName]: { frameSpecs = {} } = {} },
      componentState: { currentAnimation, currentFrame },
    } = this.props;
    const { [currentAnimation]: { numFrames = 1 } = {} } = frameSpecs;

    return (
      <div>
        <select
          value={currentAnimation}
          onChange={this.handleAnimationChange}
        >
          <option value="">Select Current Sprite</option>
          { Object.keys(frameSpecs).map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
        <FormControl>
          <InputLabel htmlFor="currentFrame">Current Frame</InputLabel>
          <Input
            onChange={this.handleFrameChange}
            inputProps={{ max: numFrames - 1, min: 0 }}
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
