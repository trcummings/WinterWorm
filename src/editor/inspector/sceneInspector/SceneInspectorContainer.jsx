// @flow
import React, { PureComponent } from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

// import Collapse from 'Editor/components/Collapse';
import TitleMenu from 'Editor/components/TitleMenu';
import Divider from 'material-ui/Divider';

import { getGameObjects } from 'Editor/modules/data';

import type { ReqFn } from 'Editor/aspects/GameObjectInterface';
import type { Id, Scene } from 'Editor/types';

const getScenes = getGameObjects('scenes');
const getId = (_, ownProps) => ownProps.id;

const getScene = createSelector([getScenes, getId], (scenes, id) => scenes[id]);

const mapStateToProps = (state, ownProps) => ({
  scene: getScene(state, ownProps),
});

type Props = {
  id: Id,
  scene: Scene,
  request: ReqFn,
};

export class SceneInspectorContainer extends PureComponent<Props> { // eslint-disable-line
  props: Props;

  render() {
    const { scene } = this.props;

    return (
      <div>
        <TitleMenu label={scene.label} />
        <Divider />
        { JSON.stringify(scene, null, 2) }
      </div>
    );
  }
}

export default connect(mapStateToProps)(SceneInspectorContainer);
