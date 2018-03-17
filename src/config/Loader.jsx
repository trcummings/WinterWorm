import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import { view, lensPath } from 'ramda';

import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import red from 'material-ui/colors/red';

import { INIT_START, INIT_MESSAGE, INIT_ERROR, INIT_END } from 'App/actionTypes';

import ConfigCard from './ConfigCard';
import { FILE_LIST, NEW_FILE, LOADING } from './DialogControl';
import { SELECTED_FILE } from './LoadFiles';
import { closeConfig } from './util';

export const FILE_FROM = 'fileFrom';
const IS_LOADING = 'isLoading';
const MESSAGE = 'message';

export default class Loader extends PureComponent {
  static propTypes = {
    updateSection: PropTypes.func.isRequired,
    sections: PropTypes.shape({
      [FILE_LIST]: PropTypes.object.isRequired,
      [NEW_FILE]: PropTypes.object.isRequired,
      [LOADING]: PropTypes.object.isRequired,
    }),
  }

  state = {
    error: null,
  }

  componentDidMount() {
    const { updateSection } = this.props;
    const filename = this.getFromState(SELECTED_FILE, '');
    const isNew = this.getFromState(FILE_FROM, '') === NEW_FILE;

    ipcRenderer.on(INIT_MESSAGE, (event, message) => (
      updateSection([LOADING, MESSAGE], message)
        .then(() => event.sender.send(INIT_MESSAGE))
    ));

    ipcRenderer.once(INIT_END, () => (
      updateSection([LOADING, MESSAGE], 'Complete!')
        .then(() => updateSection([LOADING, IS_LOADING], false))
        .then(() => ipcRenderer.send(INIT_END))
    ));

    ipcRenderer.on(INIT_ERROR, (_, error) => this.setState({ error }));

    updateSection([LOADING, IS_LOADING], true)
      .then(() => updateSection([LOADING, MESSAGE], 'Initializing...'))
      .then(() => ipcRenderer.send(INIT_START, { filename, isNew }));
  }

  getFromState = (prop, def) => view(lensPath([LOADING, prop]), this.props.sections) || def;

  render() {
    const isLoading = this.getFromState(IS_LOADING, false);
    const loadingMessage = this.getFromState(MESSAGE, '');
    const { error } = this.state;

    return (
      <ConfigCard
        title={
          this.getFromState(FILE_FROM, '') === NEW_FILE
            ? 'Editor - Generating New Editor Config...'
            : 'Editor - Loading File...'
        }
        body={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {error ? (
              <div style={{ padding: '8px', color: red['500'] }}>
                { JSON.stringify(error, null, 2) }
              </div>
            ) : (
              <Fragment>
                { isLoading && <CircularProgress size={60} thickness={7} /> }
                <div style={{ padding: '8px' }}>{ loadingMessage }</div>
              </Fragment>
            )}
          </div>
        }
        actions={[
          <Button
            key="close"
            title="Close"
            color="primary"
            disabled={!error}
            style={{ float: 'left' }}
            onClick={() => closeConfig()}
          >Close</Button>,
          <Button
            disabled
            key="create"
            title="Create"
            color="primary"
            style={{ float: 'right' }}
          >Create</Button>,
          <Button
            disabled
            key="back"
            title="Back"
            color="primary"
            style={{ float: 'right' }}
          >Back</Button>,
        ]}
      />
    );
  }
}
