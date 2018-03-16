//
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

export default class PositionParam extends PureComponent {
  static propTypes = {
    param: PropTypes.object.isRequired,
    componentState: PropTypes.object,
    updateParam: PropTypes.func.isRequired,
  }

  updateParam = key => (_, newValue) => {
    const { updateParam, componentState } = this.props;
    const val = newValue !== undefined ? parseInt(newValue, 10) : undefined;
    return updateParam(Object.assign({}, componentState, { [key]: val }));
  }

  render() {
    const { componentState: { x, y }, param } = this.props;

    return (
      <div>
        <TextField
          value={x}
          onChange={this.updateParam('x')}
          floatingLabelText="X Position (in px)"
          type={param.x.type}
        />
        <TextField
          value={y}
          onChange={this.updateParam('y')}
          floatingLabelText="Y Position (in px)"
          type={param.y.type}
        />
      </div>
    );
  }
}
