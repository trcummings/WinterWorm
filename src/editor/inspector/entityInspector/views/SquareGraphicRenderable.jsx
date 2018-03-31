// @flow
import { ipcRenderer } from 'electron';
import React, { PureComponent } from 'react';

import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

import { DRAG_ENTITY } from 'App/actionTypes';
import { type Unit } from 'Game/engine/pixi';
import type { EntityId } from 'Editor/types';

export type SGRContract = {
  w: {
    type: Unit,
    defaultsTo: Unit,
  },
  h: {
    type: Unit,
    defaultsTo: Unit,
  },
  color: {
    type: string,
    defaultsTo: '#000000'
  }
};

export type SGRState = {
  h: Unit,
  w: Unit,
  color: string,
};

type Props = {
  entityId: EntityId,
  contract: SGRContract,
  componentState: SGRState,
  updateComponentState: SGRState => void,
};

export default class SquareGraphicRenderable extends PureComponent<Props> {
  props: Props;

  handleUpdate = (key: $Keys<SGRState>) =>
    (event: SyntheticEvent<HTMLInputElement>) => {
      const { componentState, updateComponentState } = this.props;
      const value = key === 'h' || key === 'w'
        ? parseFloat(event.currentTarget.value || 0, 10)
        : event.currentTarget.value;

      updateComponentState({ ...componentState, [key]: value });
    }

  render() {
    const { componentState: { h, w }, contract } = this.props;

    return (
      <div style={{ display: 'flex' }}>
        <FormControl>
          <InputLabel htmlFor="h">Height (in units)</InputLabel>
          <Input
            id="h"
            value={h}
            type={contract.h.type}
            onChange={this.handleUpdate('h')}
            inputProps={{ step: 0.1 }}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="w">Width (in units)</InputLabel>
          <Input
            id="w"
            value={w}
            type={contract.w.type}
            onChange={this.handleUpdate('w')}
            inputProps={{ step: 0.1 }}
          />
        </FormControl>
      </div>
    );
  }
}
