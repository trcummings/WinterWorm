import { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  getCurrentScene,
  getScenes,
  selectScene,
  addNewScene,
} from '../modules/scenes';

const mapStateToProps = state => ({
  currentScene: getCurrentScene(state),
  scenes: getScenes(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addScene: addNewScene,
  setCurrentScene: selectScene,
}, dispatch);

class SceneControlUndec extends PureComponent {
  render() {
    const {
      children,
      addScene,
      setCurrentScene,
      scenes,
      currentScene,
    } = this.props;

    return children({
      scenes,
      currentScene,
      addScene,
      setCurrentScene,
    });
  }
}

const SceneControl = connect(mapStateToProps, mapDispatchToProps)(SceneControlUndec);
SceneControl.displayName = 'SceneControl';

export default SceneControl;
