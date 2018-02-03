// @flow
import React, { PureComponent } from 'react';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import CurrentScene from './CurrentScene';
import Scenes from './Scenes';
import Entities from './Entities';

import {
  CURRENT_SCENE,
  SCENES,
  ENTITIES,
} from '../../game/engine/symbols';

export default class Library extends PureComponent { // eslint-disable-line
  state = {
    selected: null,
  };

  selectType = type => () => this.setState({ selected: type });

  render() {
    const { selected } = this.state;

    return (
      <div style={{ display: 'inline-block', width: '100%' }}>
        <div style={{ display: 'inline-block', width: '50%' }}>
          <List>
            <Subheader>Object Types</Subheader>
            <ListItem
              key={CURRENT_SCENE}
              primaryText="Current Scene"
              onClick={this.selectType(CURRENT_SCENE)}
            />
            <ListItem
              key={SCENES}
              primaryText="Scenes"
              onClick={this.selectType(SCENES)}
            />
            <ListItem
              key={ENTITIES}
              primaryText="Entities"
              onClick={this.selectType(ENTITIES)}
            />
          </List>
        </div>
        <div style={{ display: 'inline-block', width: '50%' }}>
          { selected === CURRENT_SCENE && <CurrentScene /> }
          { selected === SCENES && <Scenes /> }
          { selected === ENTITIES && <Entities /> }
        </div>
      </div>
    );
  }
}
