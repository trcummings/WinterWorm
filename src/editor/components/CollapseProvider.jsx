// @flow
import React, { PureComponent, type Element } from 'react';

import { Card, CardHeader, CardText } from 'material-ui/Card';
import { grey500 } from 'material-ui/styles/colors';

type Name = string;

type Props = {
  requestToggleCollapse: Name => void,
  isWindowMinimized: boolean,
  children: [Element<*>, Element<*>],
  name: Name,
  style?: {},
};

type State = {

};

const updateToggle = (state = {}, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case TOGGLE_WINDOW: {
      const isOpen = state[payload] === OPEN;
      return {
        ...state,
        [payload]: isOpen
          ? MINIMIZED
          : OPEN,
      };
    }
    default: return state;
  }
};

export default class CollapseProvider extends PureComponent<Props, State> {
  props: Props

  static defaultProps = {
    style: { padding: '8px', backgroundColor: grey500 },
  }

  toggleWindow = () => {
    const { requestToggleCollapse, name } = this.props;
    requestToggleCollapse(name);
  }

  render() {
    const {
      children: [child1, child2],
      isWindowMinimized,
      style,
    } = this.props;

    return (
      <Card expanded={!isWindowMinimized} expandable>
        <CardHeader
          style={style}
          title={child1}
          onClick={this.toggleWindow}
          showExpandableButton
        />
        <CardText expandable style={{ padding: 0 }}>
          { child2 }
        </CardText>
      </Card>
    );
  }
}
