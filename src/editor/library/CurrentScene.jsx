//
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { grey300 } from 'material-ui/styles/colors';

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
        <Subheader>Current Scene</Subheader>
        <Divider />
        { Object.keys(scenes).map(id => (
          <ListItem
            key={id}
            style={{ backgroundColor: id === currentScene ? grey300 : undefined }}
            primaryText={scenes[id].label}
            onClick={() => setAsCurrentScene(id)}
          />
        )) }
      </List>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentScene);
