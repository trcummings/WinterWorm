//
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import grey from 'material-ui/colors/grey';

const flex = {
  width: '100%',
  display: 'flex',
  alignItems: 'top',
  justifyContent: 'space-between',
};

const left = { height: '100%', width: '50%', borderRight: `1px solid ${grey['300']}` };
const right = { height: '100%', width: 'calc(50% - 1px)' };

export default class VerticalDivider extends PureComponent { // eslint-disable-line
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
  }
  render() {
    const [leftChild, rightChild] = this.props.children;

    return (
      <div style={flex}>
        <div style={left}> {leftChild} </div>
        <div style={right}>{ rightChild }</div>
      </div>
    );
  }
}
