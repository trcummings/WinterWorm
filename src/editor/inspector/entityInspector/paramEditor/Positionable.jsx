// @flow
import React, { PureComponent } from 'react';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

type PositionableContract = {
  x: {
    type: number,
    defaultsTo: number,
  },
  y: {
    type: number,
    defaultsTo: number,
  },
};

type PositionableState = {
  x: number,
  y: number,
};

type Props = {
  contract: PositionableContract,
  componentState: PositionableState,
  updateParam: PositionableState => void,
};

export default class Positionable extends PureComponent<Props> {
  props: Props;

  updateParam = (key: $Keys<PositionableState>) => (event: Event) => {
    const { updateParam, componentState } = this.props;
    const value = event.target.value;
    const val = value !== undefined ? parseInt(value, 10) : undefined;
    return updateParam(Object.assign({}, componentState, { [key]: val }));
  }

  render() {
    const { componentState: { x, y }, contract } = this.props;

    return (
      <div style={{ display: 'flex' }}>
        <FormControl>
          <InputLabel htmlFor="x">X Position (in px)</InputLabel>
          <Input id="x" value={x} type={contract.x.type} onChange={this.updateParam('x')} />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="y">Y Position (in px)</InputLabel>
          <Input id="y" value={y} type={contract.y.type} onChange={this.updateParam('y')} />
        </FormControl>
      </div>
    );
  }
}
