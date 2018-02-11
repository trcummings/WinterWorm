// @flow
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import { components, symbols } from 'Editor/constants';
import { getSpecs } from 'Editor/modules/specs';
import { setEntity, getInspectorEntity } from 'Editor/modules/inspector/entityInspector';

import ParamEditor from './paramEditor/ParamEditor';

const mapStateToProps = (state, ownProps) => ({
  entity: getSpecs(state)[symbols.ENTITIES][ownProps.id],
  inspectorEntity: getInspectorEntity(state, ownProps),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateEntity: setEntity,
}, dispatch);

const componentLabels = Object.keys(components).reduce((total, key) => ({
  ...total,
  [components[key].id]: components[key].label,
}), {});

export class ComponentCard extends PureComponent {
  static propTypes = {
    componentState: PropTypes.object.isRequired,
    component: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
  };

  updateComponentState = (newComponentState) => {
    const { updateComponentState, index } = this.props;
    return updateComponentState(index, newComponentState);
  }

  render() {
    const {
      component: { id, contract, subscriptions },
      componentState,
    } = this.props;

    return (
      <Card>
        <CardTitle title={componentLabels[id]} subtitle={`Id: ${id}`} />
        <Divider />
        <CardText>
          { JSON.stringify(subscriptions, null, 2) }
          <Divider />
          <ParamEditor
            contract={contract}
            componentState={componentState}
            updateParam={this.updateComponentState}
            parameters={{}}
          />
        </CardText>
      </Card>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentCard);
