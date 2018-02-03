// @flow
import React, { PureComponent } from 'react';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import VerticalDivider from '../components/VerticalDivider';

import { default as CurrentScene } from './CurrentScene';
import { default as Scenes } from './Scenes';
import { default as Entities } from './Entities';

import {
  CURRENT_SCENE,
  SCENES,
  ENTITIES,
} from '../../game/engine/symbols';

export default class Library extends PureComponent {
  state = {
    selected: null,
  };

  selectType = type => () => this.setState({ selected: type });

  render() {
    const { selected } = this.state;

    return (
      <VerticalDivider>
        <List>
          <Subheader>Object Types</Subheader>
          <Divider />
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
        <div style={{ height: '100%', width: '100%' }}>
          { selected === CURRENT_SCENE && <CurrentScene /> }
          { selected === SCENES && <Scenes /> }
          { selected === ENTITIES && <Entities /> }
        </div>
      </VerticalDivider>
    );
  }
}
