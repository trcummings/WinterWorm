import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';

export default class SnackbarControl extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  state = {
    open: false,
    message: '',
  };

  openSnackbar = message => this.setState({ open: true, message });
  handleRequestClose = () => this.setState({ open: false });

  render() {
    return (
      <Fragment>
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        { this.props.children({ openSnackbar: this.openSnackbar })}
      </Fragment>
    );
  }
}
