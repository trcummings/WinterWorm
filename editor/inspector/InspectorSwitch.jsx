// @flow
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getInspectorControl } from '../modules/inspector';

import { default as EntityInspectorContainer } from './entityInspector/EntityInspectorContainer';

import {
  CURRENT_SCENE,
  SCENES,
  ENTITIES,
} from '../../game/engine/symbols';

const mapStateToProps = (state, ownProps) => ({
  ...getInspectorControl(state, ownProps),
});

export class InspectorSwitch extends PureComponent {
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

    switch (inspectorType) {
      case CURRENT_SCENE: return <div>{ id }</div>;
      case SCENES: return <div>{ id }</div>;
      case ENTITIES: return <EntityInspectorContainer id={id} />;
      default: return null;
    }
  }
}

export default connect(mapStateToProps)(InspectorSwitch);
