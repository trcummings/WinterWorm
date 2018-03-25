// @flow
import React, { Fragment, Children, PureComponent, type Element } from 'react';

import Divider from 'material-ui/Divider';
import MuiCollapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';

import { default as CollapseControl, type Name } from 'Editor/aspects/CollapseControl';

type Props = {
  children: [Element<*>, Element<*>],
  name: Name,
  style?: {},
};

export default class Collapse extends PureComponent<Props> { // eslint-disable-line
  props: Props

  render() {
    const { children, style, name } = this.props;
    const [child1, child2] = Children.toArray(children);

    return (
      <CollapseControl name={name}>
        {({ toggle, isCollapsed }) => (
          <Fragment>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '24px',
                marginBottom: isCollapsed ? undefined : '.5em',
              }}
            >
              <div>{ child1 }</div>
              <div
                style={{ height: '100%', width: '100%', cursor: 'pointer' }}
                onClick={toggle}
              >
                {isCollapsed
                  ? <ExpandMore style={{ float: 'right' }} />
                  : <ExpandLess style={{ float: 'right' }} />
                }
              </div>
            </div>
            <MuiCollapse in={!isCollapsed}>
              { child2 }
            </MuiCollapse>
          </Fragment>
        )}
      </CollapseControl>
    );
  }
}
