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

export const makeNewEntity = numScenes => ({
  id: makeId(symbols.ENTITIES),
  label: `New Entity ${numScenes + 1}`,
  components: [],
});

export class ScenesController extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
    inspector: PropTypes.shape({
      inspectorType: PropTypes.string,
      id: PropTypes.string,
    }).isRequired,
    setInInspector: PropTypes.func.isRequired,
    entities: PropTypes.shape({
      specs: PropTypes.object,
      setSpec: PropTypes.func.isRequired,
    }).isRequired,
  }

  addNewEntity = () => {
    const { entities: { specs: entities, setSpec: setEntity } } = this.props;
    const scene = makeNewEntity(Object.keys(entities).length);

    setEntity(scene);
    this.selectEntity(scene.id);
  }

  selectEntity = id => this.props.setInInspector({
    inspectorType: symbols.ENTITIES,
    id,
  });

  render() {
    const {
      children,
      entities: { specs: entities },
      inspector: { inspectorType, id },
    } = this.props;
    const selectedEntityId = inspectorType === symbols.ENTITIES ? id : null;

    return children({
      entities,
      selectedEntityId,
      addNewEntity: this.addNewEntity,
      selectEntity: this.selectEntity,
    });
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  hofToHoc(MetaSpecControl, 'entities', { specType: symbols.ENTITIES })
)(ScenesController);
