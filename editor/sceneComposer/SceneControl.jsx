import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { symbols, makeId } from '../constants';

import { default as MetaSpecControl } from '../aspects/MetaSpecControl';
import hofToHoc from '../aspects/HofToHoc';

export const makeNewScene = numScenes => ({
  id: makeId(symbols.SCENES),
  label: `New Scene ${numScenes + 1}`,
  systems: [],
});

export class SceneControl extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
    scenes: PropTypes.shape({
      specs: PropTypes.object,
      setSpec: PropTypes.func.isRequired,
    }).isRequired,
  }

  state = {
    currentScene: null,
  };

  componentWillReceiveProps(nextProps) {
    const { currentScene } = this.state;
    const { scenes: { specs: scenes } } = nextProps;
    const sceneIds = Object.keys(scenes);

    if (!sceneIds.includes(currentScene)) {
      if (sceneIds.length > 0) this.setCurrentScene(sceneIds[0]);
      else this.setCurrentScene(null);
    }
  }

  setCurrentScene = sceneId =>
    this.setState(() => ({ currentScene: sceneId }));

  render() {
    const {
      children,
      scenes: { specs: scenes, setSpec: setScene },
    } = this.props;

    return children({
      setCurrentScene: this.setCurrentScene,
      currentScene: this.state.currentScene,
      setScene,
      scenes,
    });
  }
}

export default hofToHoc(
  MetaSpecControl,
  'scenes',
  { specType: symbols.SCENES }
)(SceneControl);
