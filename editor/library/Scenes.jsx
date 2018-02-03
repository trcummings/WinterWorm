// @flow
import React, { PureComponent } from 'react';

import GameObjectList from './GameObjectList';
import { default as ScenesController } from './ScenesController';

export default class Scenes extends PureComponent { // eslint-disable-line
  render() {
    return (
      <ScenesController>
        { ({ scenes, selectedSceneId, addNewScene, selectScene }) => (
          <GameObjectList
            title="Scenes"
            selectedObjectId={selectedSceneId}
            gameObjects={Object.keys(scenes).map(id => scenes[id])}
            openInInspector={selectScene}
            addNew={addNewScene}
          />
        ) }
      </ScenesController>
    );
  }
}
