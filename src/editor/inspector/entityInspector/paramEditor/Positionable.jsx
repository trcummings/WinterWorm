// @flow
import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';

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

  updateParam = (key: $Keys<PositionableState>) => (_: Event, newValue?: string) => {
    const { updateParam, componentState } = this.props;
    const val = newValue !== undefined ? parseInt(newValue, 10) : undefined;
    return updateParam(Object.assign({}, componentState, { [key]: val }));
  }

  render() {
    const { componentState: { x, y }, contract } = this.props;

    return (
      <div style={{ display: 'flex' }}>
        <TextField
          value={x}
          onChange={this.updateParam('x')}
          floatingLabelText="X Position (in px)"
          type={contract.x.type}
        />
        <TextField
          value={y}
          onChange={this.updateParam('y')}
          floatingLabelText="Y Position (in px)"
          type={contract.y.type}
        />
      </div>
    );
  }
}
