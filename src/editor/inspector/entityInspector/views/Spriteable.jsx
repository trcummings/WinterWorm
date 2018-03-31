// @flow
import React, { PureComponent } from 'react';

import hofToHoc from 'Editor/aspects/HofToHoc';
import AssetAtlases, {
  type Atlases,
  type ResourceName,
} from 'Editor/aspects/AssetAtlases';

type SpriteableState = {
  resourceName: ResourceName,
};

type Props = {
  componentState: SpriteableState,
  updateComponentState: SpriteableState => void,
  atlases: Atlases
};

class Spriteable extends PureComponent<Props> {
  props: Props;

  pickAtlas = (event: SyntheticEvent<HTMLSelectElement>) => (
    this.props.updateComponentState({ resourceName: event.currentTarget.value })
  )

  render() {
    const { atlases, componentState: { resourceName } } = this.props;
    const value = resourceName;

    return (
      <div>
        <select value={value} onChange={this.pickAtlas}>
          <option value="">Select Asset Atlas</option>
          { Object.keys(atlases).map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>
    );
  }
}

export default hofToHoc(AssetAtlases, 'atlases')(Spriteable);
