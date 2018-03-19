// @flow
import { PureComponent } from 'react';
import { compose } from 'ramda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ENTITIES } from 'Game/engine/symbols';

import type { Id } from 'Editor/types';

import {
  default as GameObjectInterface,
  type GameObjectAspect,
} from '../aspects/GameObjectInterface';
import hofToHoc from '../aspects/HofToHoc';


import {
  selectInspector,
  getInspectorControl,
  type InspectorState,
  type Inspector,
  type InspectorId,
} from '../modules/inspector';
import { getGameObjects } from '../modules/data';

const getEntities = getGameObjects('entities');

const mapStateToProps = (state, ownProps) => ({
  inspector: getInspectorControl(state),
  entities: getEntities(state, ownProps),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setInInspector: selectInspector,
}, dispatch);

export const makeNewEntity = (numEntities: number) => ({
  label: `New Entity ${numEntities + 1}`,
});

type ChildrenProps = {
  selectedEntityId: InspectorId
};

type Props = {
  children: (ChildrenProps) => mixed,
  inspector: InspectorState,
  setInInspector: Inspector => mixed,
  gameObjects: GameObjectAspect,
};

class EntitiesController extends PureComponent<Props> {
  props: Props;

  addNewEntity = (args) => {
    const { entities, gameObjects: { request } } = this.props;
    let newEntity = args;
    if (!newEntity) newEntity = makeNewEntity(Object.keys(entities).length);

    request({
      method: 'post',
      service: 'entities/createWithScene',
      form: newEntity,
      multiple: true,
    }).then((entity) => {
      this.selectEntity(entity.id);
    });
  }

  selectEntity = (id: Id) => this.props.setInInspector({ inspectorType: ENTITIES, id });

  render() {
    const { children, entities, inspector } = this.props;
    const inspectorType = inspector.get('inspectorType');
    const id = inspector.get('id');
    const selectedEntityId = inspectorType === ENTITIES ? id : null;

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
)(EntitiesController);
