import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Divider from 'material-ui/Divider';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import grey from 'material-ui/colors/grey';

const flex = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export default class GameObjectList extends PureComponent { // eslint-disable-line
  static propTypes = {
    gameObjects: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })).isRequired,
    selectedObjectId: PropTypes.string,
    openInInspector: PropTypes.func.isRequired,
    addNew: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }

  render() {
    const { gameObjects, openInInspector, addNew, title, selectedObjectId } = this.props;
    return (
      <List style={{ padding: 0, overflowY: 'scroll', height: '200px' }}>
        <div style={flex}>
          <ListSubheader>{ title }</ListSubheader>
          <Button onClick={addNew}>
            <Icon>add box</Icon>
          </Button>
        </div>
        <Divider />
        { gameObjects.map(({ label, id }) => (
          <ListItem
            key={id}
            style={{ backgroundColor: id === selectedObjectId ? grey['300'] : undefined }}
            onClick={() => openInInspector(id)}
          >
            <ListItemText primary={label} />
          </ListItem>
        )) }
      </List>
    );
  }
}
