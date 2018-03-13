import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { symbols } from '../constants';

import { default as GameObjectInterface } from '../aspects/GameObjectInterface';
import hofToHoc from '../aspects/HofToHoc';

import {
  selectInspector,
  getInspectorControl,
} from '../modules/inspector';
import { getGameObjects } from '../modules/data';

const getScenes = getGameObjects('scenes');

const mapStateToProps = (state, ownProps) => ({
  inspector: getInspectorControl(state, ownProps),
  scenes: getScenes(state, ownProps),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setInInspector: selectInspector,
}, dispatch);

export const makeNewScene = numScenes => ({
  label: `New Scene ${numScenes + 1}`,
});

export class ScenesController extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
    inspector: PropTypes.shape({
      inspectorType: PropTypes.string,
      id: PropTypes.string,
    }).isRequired,
    setInInspector: PropTypes.func.isRequired,
    scenes: PropTypes.object.isRequired,
    gameObjects: PropTypes.shape({
      request: PropTypes.func.isRequired,
    }).isRequired,
  }

  addNewScene = () => {
    const { scenes, gameObjects: { request } } = this.props;
    const newScene = makeNewScene(Object.keys(scenes).length);

    request({ method: 'post', service: 'entities', form: newScene }).then((scene) => {
      this.selectedScene(scene.id);
    });
  }

  selectScene = id => this.props.setInInspector({
    inspectorType: symbols.SCENES,
    id,
  });

  render() {
    const { children, scenes, inspector: { inspectorType, id } } = this.props;
    const selectedSceneId = inspectorType === symbols.SCENES ? id : null;

    return children({
      scenes,
      selectedSceneId,
      addNewScene: this.addNewScene,
      selectScene: this.selectScene,
    });
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  hofToHoc(GameObjectInterface, 'gameObjects')
)(ScenesController);
