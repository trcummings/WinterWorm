// @flow
import React, { PureComponent } from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

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
  scene?: Scene,
  request: ReqFn,
};

export class SceneInspectorContainer extends PureComponent<Props> { // eslint-disable-line
  props: Props;

  render() {
    const { scene } = this.props;

    return (
      <div>
        { JSON.stringify(scene, null, 2) }
      </div>
    );
  }
}

export default connect(mapStateToProps)(SceneInspectorContainer);
