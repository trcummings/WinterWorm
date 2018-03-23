// @flow
import React, { PureComponent } from 'react';
import Checkbox from 'material-ui/Checkbox';

import { default as Collapse } from 'Editor/containers/Collapse';
import type { ComponentState, Component, EntityId } from 'Editor/types';

import ParamEditor from './paramEditor/ParamEditor';

const collapseStyle = {
  padding: 0,
};

type CSState = $PropertyType<ComponentState, 'state'>;

type Props = {
  entityId: EntityId,
  componentState: ComponentState,
  canBeActive: boolean,
  component: Component,
  contexts: Array<CSState>,
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
    return updateComponentState({ ...componentState, state: newState });
  }

  render() {
    const {
      entityId,
      canBeActive,
      component,
      componentState: { state, active },
      component: { label, contract },
      contexts,
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
          entityId={entityId}
          contexts={contexts}
          component={component}
          contract={contract}
          componentState={state}
          updateComponentState={this.updateComponentState}
        />
      </Collapse>
    );
  }
}
