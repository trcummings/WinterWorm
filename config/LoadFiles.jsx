import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { view, lensPath } from 'ramda';

import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';

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

  render() {
    const { updateSection, changeSection } = this.props;
    const files = this.getFromState(FILES, []);
    const selectedFile = this.getFromState(SELECTED_FILE, '');

    return (
      <ConfigCard
        title="Editor - Load File"
        body={
          <List value={selectedFile}>
            { files.map(({ name, stats: { ctime } }) => (
              <ListItem
                key={name}
                primaryText={name}
                onClick={() => updateSection([FILE_LIST, SELECTED_FILE], name)}
                secondaryText={`last accessed ${new Date(ctime)}`}
              />
            ))}
          </List>
        }
        actions={[
          <FlatButton
            key="close"
            label="Close"
            primary
            style={{ float: 'left' }}
            onClick={() => closeConfig()}
          />,
          <FlatButton
            key="load"
            label="Load"
            primary
            style={{ float: 'right' }}
            disabled={files.length === 0 || !selectedFile}
            onClick={() => (
              updateSection([LOADING, SELECTED_FILE], selectedFile)
                .then(() => updateSection([LOADING, FILE_FROM], FILE_LIST))
                .then(() => changeSection(LOADING))
            )}
          />,
          <FlatButton
            key="new"
            label="New"
            primary
            style={{ float: 'right' }}
            onClick={() => changeSection(NEW_FILE)}
          />,
        ]}
      />
    );
  }
}
