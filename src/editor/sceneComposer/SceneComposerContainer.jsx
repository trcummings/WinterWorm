// 
import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Chip from 'material-ui/Chip';

import { systems } from '../constants';

export default class SceneComposerContainer extends PureComponent {
  static propTypes = {
    scene: PropTypes.object.isRequired,
    setScene: PropTypes.func.isRequired,
  };

  render() {
    const { scene: { systems: systemIds } } = this.props;

    return (
      <Fragment>
        { Object.keys(systems).map(systemId => (
          <Chip
            key={systemId}
            onClick={() => {}}
          >
            { systems[systemId].label }
          </Chip>
        ))}
        { systemIds.map(systemId => (
          <Chip
            key={systemId}
            onRequestDelete={() => {}}
            onClick={() => {}}
          >
            { systems[systemId].label }
          </Chip>
        ))}
      </Fragment>
    );
  }
}
