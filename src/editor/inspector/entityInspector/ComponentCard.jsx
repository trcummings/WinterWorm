// @flow
import React, { Fragment, PureComponent } from 'react';

import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';

import Collapse from 'Editor/components/Collapse';
import type { ComponentState, Component, EntityId } from 'Editor/types';

import ParamEditor from './paramEditor/ParamEditor';

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
      <Fragment>
        <Collapse name={label}>
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={this.toggleComponentActive}
          >
            <Checkbox
              disabled={!canBeActive}
              checked={active}
              style={{ width: 'auto' }}
            />
            <Typography component="h4">{label}</Typography>
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
        <Divider />
      </Fragment>
    );
  }
}
