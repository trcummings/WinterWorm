//
import React, { PureComponent } from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';

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
      <div style={{ maxHeight: '200px' }}>
        <VerticalDivider>
          <List>
            <ListItem
              key={CURRENT_SCENE}
              onClick={this.selectType(CURRENT_SCENE)}
            >
              <ListItemText primary="Current Scene" />
            </ListItem>
            <ListItem
              key={SCENES}
              onClick={this.selectType(SCENES)}
            >
              <ListItemText primary="Scenes" />
            </ListItem>
            <ListItem
              key={ENTITIES}
              onClick={this.selectType(ENTITIES)}
            >
              <ListItemText primary="Entities" />
            </ListItem>
          </List>
          <div style={{ height: '100%', width: '100%' }}>
            { selected === CURRENT_SCENE && <CurrentScene /> }
            { selected === SCENES && <Scenes /> }
            { selected === ENTITIES && <Entities /> }
          </div>
        </VerticalDivider>
      </div>
    );
  }
}
