// @flow
import React, { PureComponent } from 'react';

import hofToHoc from 'Editor/aspects/HofToHoc';
import AssetAtlases, {
  type Atlases,
  type AnimName,
} from 'Editor/aspects/AssetAtlases';
import type { Component, ComponentState } from 'Editor/types';

type SpriteRenderableState = {
  currentFrame: AnimName,
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

  pickCurrentSprite = (event: SyntheticEvent<HTMLSelectElement>) => (
    this.props.updateComponentState({ currentFrame: event.currentTarget.value })
  )

  render() {
    const {
      contexts: { spriteable: { resourceName } = {} } = {},
      atlases: { [resourceName]: { frameSpecs = {} } = {} },
      componentState: { currentFrame },
    } = this.props;

    return (
      <div>
        <select value={currentFrame} onChange={this.pickCurrentSprite}>
          <option value="">Select Current Sprite</option>
          { Object.keys(frameSpecs).map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>
    );
  }
}

export default hofToHoc(AssetAtlases, 'atlases')(SpriteRenderable);
