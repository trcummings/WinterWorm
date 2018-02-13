// @flow
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import { components } from 'Editor/constants';

import ParamEditor from './paramEditor/ParamEditor';

export const componentLabels = Object.keys(components).reduce((total, key) => ({
  ...total,
  [components[key].id]: components[key].label,
}), {});

export default class ComponentCard extends PureComponent {
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
