// @flow
import React, { PureComponent } from 'react';
import Checkbox from 'material-ui/Checkbox';

import { default as Collapse } from 'Editor/containers/Collapse';
import type { ComponentState, Component } from 'Editor/types';

import ParamEditor from './paramEditor/ParamEditor';

const collapseStyle = {
  padding: 0,
};

type CSState = $PropertyType<ComponentState, 'state'>;

type Props = {
  componentState: ComponentState,
  canBeActive: boolean,
  component: Component,
  updateComponentState: ComponentState => void,
};

export default class ComponentCard extends PureComponent<Props> {
  props: Props;

  toggleComponentActive = () => {
    const { updateComponentState, componentState } = this.props;

    return updateComponentState({
      ...componentState,
      active: !componentState.active,
    });
  }

  updateComponentState = (newState: CSState) => {
    const { updateComponentState, componentState } = this.props;

    return updateComponentState({
      ...componentState,
      state: newState,
    });
  }

  render() {
    const {
      canBeActive,
      component,
      componentState: { state, active },
      component: { label, contract },
    } = this.props;

    return (
      <Collapse style={collapseStyle} name={label}>
        <div style={{ display: 'flex' }}>
          <Checkbox
            disabled={!canBeActive}
            checked={active}
            onChange={this.toggleComponentActive}
            style={{ width: 'auto' }}
          />
          <h4 style={{ margin: 0 }}>{label}</h4>
        </div>
        <ParamEditor
          component={component}
          contract={contract}
          componentState={state}
          updateComponentState={this.updateComponentState}
        />
      </Collapse>
    );
  }
}
