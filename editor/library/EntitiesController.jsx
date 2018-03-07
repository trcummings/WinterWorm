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

const mapStateToProps = (state, ownProps) => ({
  inspector: getInspectorControl(state, ownProps),
  entities: state.data.entities || {},
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setInInspector: selectInspector,
}, dispatch);

export const makeNewEntity = numEntities => ({
  label: `New Entity ${numEntities + 1}`,
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
    entities: PropTypes.object.isRequired,
    gameObjects: PropTypes.shape({
      request: PropTypes.func.isRequired,
    }).isRequired,
  }

  addNewEntity = () => {
    const { entities, gameObjects: { request } } = this.props;
    const newEntity = makeNewEntity(Object.keys(entities).length);

    request({ method: 'post', service: 'entities', form: newEntity }).then((entity) => {
      this.selectEntity(entity.id);
    });
  }

  selectEntity = id => this.props.setInInspector({
    inspectorType: symbols.ENTITIES,
    id,
  });

  render() {
    const {
      children,
      entities,
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
  hofToHoc(GameObjectInterface, 'gameObjects')
)(ScenesController);
