// @flow
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import { components, symbols } from 'Editor/constants';
import { getSpecs } from 'Editor/modules/specs';

const mapStateToProps = (state, ownProps) => ({
  entity: getSpecs(state)[symbols.ENTITIES][ownProps.id],
});

export class EntityInspectorContainer extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    entity: PropTypes.object.isRequired,
  };

  render() {
    const { entity: { id, label } } = this.props;
    console.log(components, this.props);
    return (
      <div>
        <Subheader>{ id }</Subheader>
        <Divider />
        <Subheader>components</Subheader>

      </div>
    );
  }
}

export default connect(mapStateToProps)(EntityInspectorContainer);
