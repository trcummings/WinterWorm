// 
import React, { PureComponent } from 'react';

import GameObjectList from './GameObjectList';
import { default as EntitiesController } from './EntitiesController';

export default class Entities extends PureComponent { // eslint-disable-line
  render() {
    return (
      <EntitiesController>
        { ({ entities, selectedEntityId, addNewEntity, selectEntity }) => (
          <GameObjectList
            title="Entities"
            selectedObjectId={selectedEntityId}
            gameObjects={Object.keys(entities).map(id => entities[id])}
            openInInspector={selectEntity}
            addNew={addNewEntity}
          />
        ) }
      </EntitiesController>
    );
  }
}
