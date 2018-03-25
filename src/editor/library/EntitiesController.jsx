// @flow
import { ipcRenderer } from 'electron';
import { PureComponent } from 'react';
import { compose } from 'ramda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SELECT_INSPECTOR_ENTITY } from 'App/actionTypes';
import { ENTITIES } from 'Game/engine/symbols';
import { sendToGame } from 'Editor/ipcUtil';

import type { Id } from 'Editor/types';

import {
  default as GameObjectInterface,
  type GameObjectAspect,
} from '../aspects/GameObjectInterface';
import hofToHoc from '../aspects/HofToHoc';


import {
  INITIAL_STATE,
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
  entities: {},
  children: (ChildrenProps) => mixed,
  inspector: InspectorState,
  setInInspector: Inspector => mixed,
  gameObjects: GameObjectAspect,
};

class EntitiesController extends PureComponent<Props> {
  props: Props;

  componentDidMount() {
    ipcRenderer.on(SELECT_INSPECTOR_ENTITY, this.handleGameSelectEntity);
  }

  componentWillReceiveProps(nextProps) {
    const { inspector, entities, setInInspector } = nextProps;
    const currentId = inspector.get('id');
    const nextId = Object.keys(entities)[0];

    if (currentId && entities[currentId]) return;
    else if (!nextId) setInInspector(INITIAL_STATE.toJS());
    else this.selectEntity(nextId);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(SELECT_INSPECTOR_ENTITY, this.handleGameSelectEntity);
  }

  handleGameSelectEntity = (event, id) => {
    if (id !== this.props.inspector.get('id')) this.selectEntity(id);
  };

  addNewEntity = (args) => {
    const { entities, gameObjects: { request } } = this.props;
    let newEntity = args;
    if (!newEntity) newEntity = makeNewEntity(Object.keys(entities).length);

    request({
      method: 'post',
      service: 'entities/createWithScene',
      form: newEntity,
      multiple: true,
    }).then(({ entities: respEntities }) => {
      const [entityId] = Object.keys(respEntities);
      this.selectEntity(entityId);
    });
  }

  selectEntity = (id: Id) => {
    const { inspector, setInInspector } = this.props;
    const currentId = inspector.get('id');

    if (id === currentId) return;

    setInInspector({ inspectorType: ENTITIES, id });
    sendToGame(SELECT_INSPECTOR_ENTITY, id);
  }

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
