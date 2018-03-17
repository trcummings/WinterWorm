import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';

import { default as Collapse } from 'Editor/containers/Collapse';

import ParamEditor from './paramEditor/ParamEditor';

const collapseStyle = {
  padding: 0,
};

export default class ComponentCard extends PureComponent {
  static propTypes = {
    state: PropTypes.object.isRequired,
    component: PropTypes.object.isRequired,
    updateComponentState: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
  };

  toggleComponentActive = () => {
    const { updateComponentState, state, active, component: { id } } = this.props;
    return updateComponentState({
      componentId: id,
      active: !active,
      state,
    });
  }

  updateComponentState = (newState) => {
    const { updateComponentState, active, component: { id } } = this.props;

    return updateComponentState({
      componentId: id,
      state: newState,
      active,
    });
  }

  render() {
    const {
      component,
      component: { label, contract },
      state,
      active,
    } = this.props;

    return (
      <Collapse style={collapseStyle} name={label}>
        <div style={{ display: 'flex' }}>
          <Checkbox
            checked={active}
            onCheck={this.toggleComponentActive}
            style={{ width: 'auto' }}
          />
          <h4 style={{ margin: 0 }}>{label}</h4>
        </div>
        <ParamEditor
          component={component}
          contract={contract}
          componentState={state}
          updateParam={this.updateComponentState}
        />
      </Collapse>
    );
  }
}
