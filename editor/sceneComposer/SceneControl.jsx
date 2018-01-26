import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { symbols, makeId } from '../constants';

import { default as MetaSpecControl } from '../aspects/MetaSpecControl';

export const makeNewScene = numScenes => ({
  id: makeId(symbols.SCENES),
  label: `New Scene ${numScenes + 1}`,
  systems: [],
});

export default class SceneControl extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  state = {
    currentScene: null,
  };

  setCurrentScene = sceneId =>
    this.setState(() => ({ currentScene: sceneId }));

  render() {
    const { children } = this.props;

    return (
      <MetaSpecControl specType={symbols.SCENES}>
        { ({ specs: scenes, setSpec: addScene }) => children({
          setCurrentScene: this.setCurrentScene,
          currentScene: this.state.currentScene,
          addScene,
          scenes,
        }) }
      </MetaSpecControl>
    );
  }
}
