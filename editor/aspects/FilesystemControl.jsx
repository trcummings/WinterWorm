// @flow
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isGameSaving, startSave } from '../modules/filesystem';

const mapStateToProps = state => ({
  isSaving: isGameSaving(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  saveGame: startSave,
}, dispatch);

export class FilesystemControl extends PureComponent {
  render() {
    const { saveGame, isSaving, children } = this.props;
    return children({ saveGame, isSaving });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilesystemControl);
