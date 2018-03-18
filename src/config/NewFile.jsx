import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { view, lensPath } from 'ramda';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

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

  updateValue = event => (
    this.props.updateSection([NEW_FILE, FILENAME], event.target.value)
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
          <FormControl error={!!errorText} aria-describedby="name-error-text">
            <InputLabel htmlFor="name-error">Enter Filename</InputLabel>
            <Input id="name-error" value={filename} onChange={this.updateValue} />
            <FormHelperText id="name-error-text">{ errorText }</FormHelperText>
          </FormControl>
        }
        actions={[
          <Button
            key="close"
            title="Close"
            color="primary"
            style={{ float: 'left' }}
            onClick={() => closeConfig()}
          >Close</Button>,
          <Button
            key="create"
            title="Create"
            color="primary"
            style={{ float: 'right' }}
            onClick={() => (
              updateSection([LOADING, SELECTED_FILE], filename)
                .then(() => updateSection([LOADING, FILE_FROM], NEW_FILE))
                .then(() => changeSection(LOADING))
            )}
            disabled={isInvalidFilename}
          >Create</Button>,
          <Button
            key="back"
            title="Back"
            color="primary"
            style={{ float: 'right' }}
            onClick={() => (
              updateSection([NEW_FILE, FILENAME], '')
                .then(() => changeSection(FILE_LIST))
            )}
          >Back</Button>,
        ]}
      />
    );
  }
}
