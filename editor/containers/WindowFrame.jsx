import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, CardHeader, CardText } from 'material-ui/Card';

import {
  toggleWindow,
  isMinimized,
  CONTROL,
  LIBRARY,
  INSPECTOR,
} from '../modules/windows';

const mapStateToProps = (state, ownProps) => ({
  isWindowMinimized: isMinimized(state, ownProps),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  requestToggleWindow: toggleWindow,
}, dispatch);

class WindowFrame extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    requestToggleWindow: PropTypes.func.isRequired,
    isWindowMinimized: PropTypes.bool.isRequired,
    windowType: PropTypes.oneOf([
      CONTROL,
      LIBRARY,
      INSPECTOR,
    ]).isRequired,
  };

  toggleWindow = () => {
    const { requestToggleWindow, windowType } = this.props;
    requestToggleWindow(windowType);
  }

  render() {
    const { children, windowType, isWindowMinimized } = this.props;
    return (
      <Card expanded={!isWindowMinimized} expandable>
        <CardHeader
          style={{ padding: '8px' }}
          title={windowType}
          onClick={this.toggleWindow}
          showExpandableButton
        />
        <CardText expandable>
          { children }
        </CardText>
      </Card>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WindowFrame);
