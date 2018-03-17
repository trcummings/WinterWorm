import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { view, lensPath } from 'ramda';

import Button from 'material-ui/Button';

import ConfigCard from './ConfigCard';
import { FILE_LIST, NEW_FILE, LOADING } from './DialogControl';
import { FILE_FROM } from './Loader';
import { getSortedFiles, closeConfig } from './util';


export const SELECTED_FILE = 'selectedFile';
const FILES = 'files';

export default class LoadFiles extends PureComponent {
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
    getSortedFiles(process.env.EDITOR_FILES_PATH).then(set => (
      this.props.updateSection([FILE_LIST, FILES], set)
    ));
  }

  getFromState = (prop, def) => view(lensPath([FILE_LIST, prop]), this.props.sections) || def;

  handleSelectChange = event => (
    this.props.updateSection([FILE_LIST, SELECTED_FILE], event.target.value)
  );

  render() {
    const { updateSection, changeSection } = this.props;
    const files = this.getFromState(FILES, []);
    const selectedFile = this.getFromState(SELECTED_FILE, '');

    return (
      <ConfigCard
        title="Editor - Load File"
        body={
          <select value={selectedFile} onChange={this.handleSelectChange}>
            <option value="" />
            {files.map(({ name, stats: { ctime } }) => (
              <option key={name} value={name}>
                { `${name}: last accessed ${new Date(ctime)}` }
              </option>
            ))}
          </select>
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
            key="load"
            title="Load"
            color="primary"
            style={{ float: 'right' }}
            disabled={files.length === 0 || !selectedFile}
            onClick={() => (
              updateSection([LOADING, SELECTED_FILE], selectedFile)
                .then(() => updateSection([LOADING, FILE_FROM], FILE_LIST))
                .then(() => changeSection(LOADING))
            )}
          >Load</Button>,
          <Button
            key="new"
            title="New"
            color="primary"
            style={{ float: 'right' }}
            onClick={() => changeSection(NEW_FILE)}
          >New</Button>,
        ]}
      />
    );
  }
}
