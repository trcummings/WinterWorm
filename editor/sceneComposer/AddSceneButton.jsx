// @flow
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import { makeNewScene } from './SceneControl';

export default class AddSceneButton extends PureComponent {
  static propTypes = {
    numScenes: PropTypes.number.isRequired,
    addScene: PropTypes.func.isRequired,
    setCurrentScene: PropTypes.func.isRequired,
  };

  addScene = () => {
    const { numScenes, addScene, setCurrentScene } = this.props;
    const scene = makeNewScene(numScenes);

    addScene(scene);
    setCurrentScene(scene.id);
  }

  render() {
    return (
      <IconButton tooltip="Add Scene" onClick={this.addScene}>
        <FontIcon className="material-icons">add</FontIcon>
      </IconButton>
    );
  }
}
