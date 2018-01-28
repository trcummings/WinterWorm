// @flow
import fs from 'fs';
import path from 'path';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isGameSaving, startSave } from '../modules/filesystem';
import { loadSpec } from '../modules/specs';

const mapStateToProps = state => ({
  isSaving: isGameSaving(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  saveGame: startSave,
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
    const { saveGame, isSaving, children } = this.props;
    return children({
      saveGame,
      isSaving,
      savedFiles: this.state.files,
      loadFile: this.loadFile,
    });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilesystemControl);
