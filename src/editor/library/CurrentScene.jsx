//
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Divider from 'material-ui/Divider';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import grey from 'material-ui/colors/grey';

import { setCurrentScene, getSpecs } from '../modules/specs';
import { getGameObjects } from '../modules/data';
import { symbols } from '../constants';

const getScenes = getGameObjects('scenes');

const mapStateToProps = (state, ownProps) => ({
  scenes: getScenes(state, ownProps),
  currentScene: getSpecs(state, ownProps)[symbols.CURRENT_SCENE],
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setAsCurrentScene: setCurrentScene,
}, dispatch);

class CurrentScene extends PureComponent { // eslint-disable-line
  static propTypes = {
    scenes: PropTypes.object.isRequired, // eslint-disable-line
    currentScene: PropTypes.string,
    setAsCurrentScene: PropTypes.func.isRequired,
  };

  render() {
    const { scenes, currentScene, setAsCurrentScene } = this.props;
    return (
      <List style={{ padding: 0, overflowY: 'scroll', height: '200px' }}>
        <ListSubheader>Current Scene</ListSubheader>
        <Divider />
        { Object.keys(scenes).map(id => (
          <ListItem
            key={id}
            style={{ backgroundColor: id === currentScene ? grey['300'] : undefined }}
            onClick={() => setAsCurrentScene(id)}
          >
            <ListItemText primary={scenes[id].label} />
          </ListItem>
        )) }
      </List>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentScene);
