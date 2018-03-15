import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { view, lensPath } from 'ramda';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import ConfigCard from './ConfigCard';
import { FILE_LIST, NEW_FILE, LOADING } from './DialogControl';
import { SELECTED_FILE } from './LoadFiles';
import { FILE_FROM } from './Loader';
import { getFileSet, closeConfig } from './util';

const FILENAME = 'filename';
const FILESET = 'fileset';

export default class NewFile extends PureComponent {
  static propTypes = {
    updateSection: PropTypes.func.isRequired,
    changeSection: PropTypes.func.isRequired,
    sections: PropTypes.shape({
      [FILE_LIST]: PropTypes.object.isRequired,
      [NEW_FILE]: PropTypes.object.isRequired,
      [LOADING]: PropTypes.object.isRequired,
    }),
  }

  componentWillMount() {
    getFileSet(process.env.EDITOR_FILES_PATH).then(set => (
      this.props.updateSection([NEW_FILE, FILESET], set)
    ));
  }

  getFromState = (prop, def) => view(lensPath([NEW_FILE, prop]), this.props.sections) || def;

  isInvalidFilename = () => {
    const filename = this.getFromState(FILENAME, '');
    const fileset = this.getFromState(FILESET, new Set());

    return !filename || fileset.has(filename);
  }

  updateValue = (_, value) => (
    this.props.updateSection([NEW_FILE, FILENAME], value)
  )

  render() {
    const { updateSection, changeSection } = this.props;
    const filename = this.getFromState(FILENAME, '');
    const isInvalidFilename = this.isInvalidFilename();
    const errorText = filename && isInvalidFilename && `File with name ${filename} already exists!`;

    return (
      <ConfigCard
        title="Editor - New File"
        body={
          <TextField
            hintText="Filename"
            errorText={errorText}
            onChange={this.updateValue}
            floatingLabelText="Enter filename here"
            value={filename}
          />
        }
        actions={[
          <FlatButton
            style={{ float: 'left' }}
            key="close"
            label="Close"
            primary
            onClick={() => closeConfig()}
          />,
          <FlatButton
            key="create"
            label="Create"
            primary
            style={{ float: 'right' }}
            onClick={() => (
              updateSection([LOADING, SELECTED_FILE], filename)
                .then(() => updateSection([LOADING, FILE_FROM], NEW_FILE))
                .then(() => changeSection(LOADING))
            )}
            disabled={isInvalidFilename}
          />,
          <FlatButton
            key="back"
            label="Back"
            primary
            style={{ float: 'right' }}
            onClick={() => (
              updateSection([NEW_FILE, FILENAME], '')
                .then(() => changeSection(FILE_LIST))
            )}
          />,
        ]}
      />
    );
  }
}
