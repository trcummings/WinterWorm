// @flow
import fs from 'fs';
import path from 'path';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  isEditorSaving,
  saveEditor,
  exportSpec,
  isSpecExporting,
} from '../modules/filesystem';
import {
  isConfigSaving,
  saveConfig,
} from '../modules/config';
import { loadSpec } from '../modules/specs';

const mapStateToProps = state => ({
  isSaving: (
    isEditorSaving(state) ||
    isSpecExporting(state) ||
    isConfigSaving(state)
  ),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  saveGame: saveEditor,
  exportGameSpec: exportSpec,
  exportConfig: saveConfig,
  loadSpecFromFile: loadSpec,
}, dispatch);

const filePath = path.resolve(process.env.CONFIG_PATH, './editorFiles');

export class FilesystemControl extends PureComponent {
  state = {
    files: [],
  };

  componentWillMount() {
    fs.readdir(filePath, 'utf8', this.setLoadedFiles);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isSaving && !nextProps.isSaving) {
      fs.readdir(filePath, 'utf8', this.setLoadedFiles);
    }
  }

  setLoadedFiles = (err, files) => {
    const sortedFiles = files.slice().sort((fN1, fN2) => {
      const d1 = fN1.split('_')[1].split('.json')[0];
      const d2 = fN2.split('_')[1].split('.json')[0];

      return new Date(parseInt(d2, 10)) - new Date(parseInt(d1, 10));
    });

    this.setState({ files: sortedFiles });
  }

  loadFile = (fileName) => {
    const { loadSpecFromFile } = this.props;
    fs.readFile(path.resolve(filePath, fileName), 'utf8', (err, file) => (
      loadSpecFromFile(JSON.parse(file))
    ));
  }

  render() {
    const {
      isSaving,
      children,
      saveGame,
      exportGameSpec,
      exportConfig,
    } = this.props;

    return children({
      saveGame,
      isSaving,
      exportGameSpec,
      exportConfig,
      savedFiles: this.state.files,
      loadFile: this.loadFile,
    });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilesystemControl);
