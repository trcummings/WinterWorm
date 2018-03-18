//
import React, { PureComponent } from 'react';
// import List, { ListItem, ListItemText } from 'material-ui/List';
//
// import VerticalDivider from '../components/VerticalDivider';
//
// import { default as CurrentScene } from './CurrentScene';
// import { default as Scenes } from './Scenes';
// import { default as Entities } from './Entities';
import GameObjectList from './GameObjectList';
import { default as EntitiesController } from './EntitiesController';

// import {
//   CURRENT_SCENE,
//   SCENES,
//   ENTITIES,
// } from '../../game/engine/symbols';

export default class Library extends PureComponent { // eslint-disable-line
  // state = {
  //   selected: null,
  // };
  //
  // selectType = type => () => this.setState({ selected: type });

  render() {
    // const { selected } = this.state;

    return (
      // <ScenesController>
      //   { ({ scenes, selectedSceneId, addNewScene, selectScene }) => (
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
    // ) }
    );

    // return (
    //   <div style={{ maxHeight: '200px' }}>
    //     <VerticalDivider>
    //       <List>
    //         <ListItem
    //           key={CURRENT_SCENE}
    //           onClick={this.selectType(CURRENT_SCENE)}
    //         >
    //           <ListItemText primary="Current Scene" />
    //         </ListItem>
    //         <ListItem
    //           key={SCENES}
    //           onClick={this.selectType(SCENES)}
    //         >
    //           <ListItemText primary="Scenes" />
    //         </ListItem>
    //         <ListItem
    //           key={ENTITIES}
    //           onClick={this.selectType(ENTITIES)}
    //         >
    //           <ListItemText primary="Entities" />
    //         </ListItem>
    //       </List>
    //       <div style={{ height: '100%', width: '100%' }}>
    //         { selected === CURRENT_SCENE && <CurrentScene /> }
    //         { selected === SCENES && <Scenes /> }
    //         { selected === ENTITIES && <Entities /> }
    //       </div>
    //     </VerticalDivider>
    //   </div>
    // );
  }
}
