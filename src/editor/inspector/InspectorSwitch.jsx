import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { default as GameObjectInterface } from 'Editor/aspects/GameObjectInterface';
import {
  getInspectorId,
  getInspectorType,
} from 'Editor/modules/inspector';

import { default as EntityInspectorContainer } from './entityInspector/EntityInspectorContainer';
import { default as SceneInspectorContainer } from './sceneInspector/SceneInspectorContainer';

import {
  CURRENT_SCENE,
  SCENES,
  ENTITIES,
} from '../../game/engine/symbols';

const mapStateToProps = (state, ownProps) => ({
  id: getInspectorId(state, ownProps),
  inspectorType: getInspectorType(state, ownProps),
});

const Dummy = ({ id }) => <div>{ id }</div>;

export class InspectorSwitch extends PureComponent { // eslint-disable-line
  static propTypes = {
    id: PropTypes.string,
    inspectorType: PropTypes.oneOf([
      CURRENT_SCENE,
      SCENES,
      ENTITIES,
      null,
    ]),
  };

  render() {
    const { inspectorType, id } = this.props;
    let InspectorComponent = Dummy;

    switch (inspectorType) {
      case ENTITIES: {
        InspectorComponent = EntityInspectorContainer;
        break;
      }
      case SCENES: {
        InspectorComponent = SceneInspectorContainer;
        break;
      }
      case CURRENT_SCENE:
      default: { break; }
    }

    return (
      <GameObjectInterface>
        { ({ request }) => <InspectorComponent id={id} request={request} />}
      </GameObjectInterface>
    );
  }
}

export default connect(mapStateToProps)(InspectorSwitch);
