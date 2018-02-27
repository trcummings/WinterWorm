// 
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Subheader from 'material-ui/Subheader';
import { grey300 } from 'material-ui/styles/colors';

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
          <Subheader>{ title }</Subheader>
          <FlatButton onClick={addNew}>
            <FontIcon className="material-icons">
              add box
            </FontIcon>
          </FlatButton>
        </div>
        <Divider />
        { gameObjects.map(({ label, id }) => (
          <ListItem
            key={id}
            primaryText={label}
            style={{ backgroundColor: id === selectedObjectId ? grey300 : undefined }}
            onClick={() => openInInspector(id)}
          />
        )) }
      </List>
    );
  }
}
