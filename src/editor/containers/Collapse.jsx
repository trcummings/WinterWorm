// @flow
import React, { Children, PureComponent, type Element } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

import grey from 'material-ui/colors/grey';

import { type Map } from 'immutable';

import {
  toggleWindow,
  addWindow,
  removeWindow,
  getAllWindows,
  IS_COLLAPSED,
} from '../modules/windows';

export type Name = string;

type Props = {
  allCollapses: Map<Name, boolean>,
  requestToggleCollapse: Array<Name> => void,
  requestAddCollapse: Array<Name> => void,
  requestRemoveCollapse: Array<Name> => void,
  isWindowMinimized: boolean,
  children: [Element<*>, Element<*>],
  name: Name,
  style?: {},
};

type Context = {
  getAllNames: () => Array<Name>
};

const mapStateToProps = state => ({
  allCollapses: getAllWindows(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  requestToggleCollapse: toggleWindow,
  requestAddCollapse: addWindow,
  requestRemoveCollapse: removeWindow,
}, dispatch);

class Collapse extends PureComponent<Props> {
  props: Props

  static defaultProps = {
    style: { padding: '8px', backgroundColor: grey['500'] },
  }

  static contextTypes = {
    getAllNames: PropTypes.func,
  }

  static childContextTypes = {
    getAllNames: PropTypes.func.isRequired,
  };

  getChildContext(): Context {
    return { getAllNames: this.getAllNames };
  }

  componentDidMount() {
    this.props.requestAddCollapse(this.getAllNames());
  }

  componentWillUnount() {
    this.props.requestRemoveCollapse(this.getAllNames());
  }

  getAllNames = (): Array<Name> => {
    const { name } = this.props;
    const { getAllNames } = (this.context: Context);

    if (!getAllNames) return [name];
    return [...getAllNames(), name];
  }

  isCollapsed = (): boolean => {
    const path = [...this.getAllNames(), IS_COLLAPSED];
    const collapseState = this.props.allCollapses.getIn(path);

    return (
      typeof collapseState === 'undefined'
      || (typeof collapseState === 'boolean' && collapseState)
    );
  };

  toggleWindow = () => {
    const { requestToggleCollapse } = this.props;
    requestToggleCollapse(this.getAllNames());
  }

  render() {
    const { children, style } = this.props;
    const [child1, child2] = Children.toArray(children);

    return (
      <ExpansionPanel expanded={!this.isCollapsed()} onChange={this.toggleWindow}>
        <ExpansionPanelSummary
          style={style}
          expandIcon={<ExpandMoreIcon />}
        >
          { child1 }
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ padding: 0, margin: 0 }}>
          { child2 }
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Collapse);
