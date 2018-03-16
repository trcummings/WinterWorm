import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import ParamEditor from './paramEditor/ParamEditor';

export default class ComponentCard extends PureComponent {
  static propTypes = {
    componentState: PropTypes.object.isRequired,
    component: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
  };

  updateComponentState = (newComponentState) => {
    const { updateComponentState, index, component: { id } } = this.props;
    return updateComponentState(index, id, newComponentState);
  }

  render() {
    const {
      component,
      component: { label, id, contract, subscriptions },
      componentState,
    } = this.props;

    return (
      <Card>
        <CardTitle title={label} subtitle={`Id: ${id}`} />
        <Divider />
        <CardText>
          { JSON.stringify(subscriptions, null, 2) }
          <Divider />
          <ParamEditor
            component={component}
            contract={contract}
            componentState={componentState}
            updateParam={this.updateComponentState}
          />
        </CardText>
      </Card>
    );
  }
}
