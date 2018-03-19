// @flow
import React, { PureComponent } from 'react';
import Checkbox from 'material-ui/Checkbox';

import { default as Collapse } from 'Editor/containers/Collapse';
import type { Id, ComponentState, Component } from 'Editor/types';

import ParamEditor from './paramEditor/ParamEditor';

const collapseStyle = {
  padding: 0,
};

type CSState = $PropertyType<ComponentState, 'state'>;
type CSActive = $PropertyType<ComponentState, 'active'>;
export type UCSArgs = {
  componentId: Id,
  active: CSActive,
  state: CSState,
};

type Props = {
  state: CSState,
  active: CSActive,
  component: Component,
  updateComponentState: UCSArgs => void,
};

export default class ComponentCard extends PureComponent<Props> {
  props: Props;

  toggleComponentActive = () => {
    const { updateComponentState, state, active, component: { id } } = this.props;
    return updateComponentState({
      componentId: id,
      active: !active,
      state,
    });
  }

  updateComponentState = (newState: CSState) => {
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
