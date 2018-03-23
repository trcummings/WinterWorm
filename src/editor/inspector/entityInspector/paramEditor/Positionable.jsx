// @flow
import { ipcRenderer } from 'electron';
import React, { PureComponent } from 'react';

import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

import { DRAG_ENTITY } from 'App/actionTypes';
import { POSITION_CHANGE } from 'Game/engine/symbols';
import { emitQueueEvent } from 'Editor/ipcUtil';
import { type Unit } from 'Game/engine/pixi';
import type { EntityId } from 'Editor/types';

type PositionableContract = {
  x: {
    type: Unit,
    defaultsTo: Unit,
  },
  y: {
    type: Unit,
    defaultsTo: Unit,
  },
};

export type PositionableState = {
  x: Unit,
  y: Unit,
};

type Props = {
  entityId: EntityId,
  contract: PositionableContract,
  componentState: PositionableState,
  updateComponentState: PositionableState => void,
};

export type PositionChange = {
  offsetX: Unit,
  offsetY: Unit,
};

export default class Positionable extends PureComponent<Props> {
  props: Props;

  componentDidMount() {
    ipcRenderer.on(DRAG_ENTITY, this.handleGameDragEntity);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(DRAG_ENTITY, this.handleGameDragEntity);
  }

  handleGameDragEntity = (_, data: PositionableState) => {
    const { updateComponentState, componentState } = this.props;
    const isDifferent = Object.keys(componentState)
      .some(key => componentState[key] !== data[key]);

    if (isDifferent) updateComponentState(data);
  }

  handleUpdate = (key: $Keys<PositionableState>) =>
    (event: SyntheticEvent<HTMLInputElement>) => {
      const { componentState } = this.props;
      const value = parseFloat(event.currentTarget.value || 0, 10);

      this.updateComponentState({ ...componentState, [key]: value });
    }

  updateComponentState = (newState: PositionableState) => {
    const { updateComponentState, componentState, entityId } = this.props;
    const offset = this.calculateOffset(componentState, newState);

    return updateComponentState(newState)
      .then(() => emitQueueEvent(offset, [POSITION_CHANGE, entityId]));
  }

  calculateOffset = (s1: PositionableState, s2: PositionableState): PositionChange => ({
    offsetX: s2.x - s1.x,
    offsetY: s2.y - s1.y,
  })

  render() {
    const { componentState: { x, y }, contract } = this.props;

    return (
      <div style={{ display: 'flex' }}>
        <FormControl>
          <InputLabel htmlFor="x">X Position (in units)</InputLabel>
          <Input id="x" value={x} type={contract.x.type} onChange={this.handleUpdate('x')} />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="y">Y Position (in units)</InputLabel>
          <Input id="y" value={y} type={contract.y.type} onChange={this.handleUpdate('y')} />
        </FormControl>
      </div>
    );
  }
}
