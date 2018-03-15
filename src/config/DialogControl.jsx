import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { assocPath } from 'ramda';

export const FILE_LIST = 'fileList';
export const NEW_FILE = 'newFile';
export const LOADING = 'loading';

export default class DialogControl extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  state = {
    selectedDialog: FILE_LIST,
    sections: {
      [FILE_LIST]: {},
      [NEW_FILE]: {},
      [LOADING]: {},
    },
  };

  updateSection = (path, value) => new Promise((resolve) => {
    this.setState({ sections: assocPath(path, value, this.state.sections) }, resolve);
  });

  changeSection = toSection => this.setState({ selectedDialog: toSection })

  render() {
    const { selectedDialog, sections } = this.state;
    return this.props.children({
      updateSection: this.updateSection,
      changeSection: this.changeSection,
      selectedDialog,
      sections,
    });
  }
}
