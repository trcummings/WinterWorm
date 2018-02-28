import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { symbols, makeId } from '../constants';

import { default as MetaSpecControl } from '../aspects/MetaSpecControl';
import hofToHoc from '../aspects/HofToHoc';

import {
  selectInspector,
  getInspectorControl,
} from '../modules/inspector';

const mapStateToProps = (state, ownProps) => ({
  inspector: getInspectorControl(state, ownProps),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setInInspector: selectInspector,
}, dispatch);

export const makeNewScene = numScenes => ({
  id: makeId(symbols.SCENES),
  label: `New Scene ${numScenes + 1}`,
  systems: [],
  entities: [],
});

export class ScenesController extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
    inspector: PropTypes.shape({
      inspectorType: PropTypes.string,
      id: PropTypes.string,
    }).isRequired,
    setInInspector: PropTypes.func.isRequired,
    scenes: PropTypes.shape({
      specs: PropTypes.object,
      setSpec: PropTypes.func.isRequired,
    }).isRequired,
  }

  addNewScene = () => {
    const { scenes: { specs: scenes, setSpec: setScene } } = this.props;
    const scene = makeNewScene(Object.keys(scenes).length);

    setScene(scene);
    this.selectScene(scene.id);
  }

  selectScene = id => this.props.setInInspector({
    inspectorType: symbols.SCENES,
    id,
  });

  render() {
    const {
      children,
      scenes: { specs: scenes },
      inspector: { inspectorType, id },
    } = this.props;
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
  hofToHoc(MetaSpecControl, 'scenes', { specType: symbols.SCENES })
)(ScenesController);
