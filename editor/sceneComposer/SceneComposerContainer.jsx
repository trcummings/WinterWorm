// @flow
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class SceneComposerContainer extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
  };

  static defaultProps = {
    label: '',
  };

  render() {
    return <div>{ this.props.id }{ this.props.label }</div>;
  }
}
