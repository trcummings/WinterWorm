// @flow
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, CardTitle, CardText } from 'material-ui/Card';
// import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
// import FlatButton from 'material-ui/FlatButton';
// import FontIcon from 'material-ui/FontIcon';
// import DropDownMenu from 'material-ui/DropDownMenu';
// import MenuItem from 'material-ui/MenuItem';

import { components, symbols } from 'Editor/constants';
import { getSpecs } from 'Editor/modules/specs';
// import { default as VerticalDivider } from 'Editor/components/VerticalDivider';
import { setEntity, getInspectorEntity } from 'Editor/modules/inspector/entityInspector';

const mapStateToProps = (state, ownProps) => ({
  entity: getSpecs(state)[symbols.ENTITIES][ownProps.id],
  inspectorEntity: getInspectorEntity(state, ownProps),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateEntity: setEntity,
}, dispatch);

const componentLabels = Object.keys(components).reduce((total, key) => ({
  ...total,
  [components[key].id]: components[key].label,
}), {});

const Param = ({ param, type }) => {
  switch (type) {
    case symbols.POSITION_PARAM: {
      const { x, y, z } = param;

      return (
        <div>
          <TextField
            defaultValue={x.defaultsTo}
            floatingLabelText="X Pos"
            type={x.type}
          />
          <TextField
            defaultValue={y.defaultsTo}
            floatingLabelText="Y Pos"
            type={y.type}
          />
          <TextField
            defaultValue={z.defaultsTo}
            floatingLabelText="Z Index"
            type={z.type}
          />
        </div>
      );
    }
    default: return <div>type not currently supported</div>;
  }
};

const ParamEditor = ({ id, param, type, label, children, parameters }) => (
  <Card>
    { label }
    <div>
      <Param type={type} param={param} />
    </div>
    <div>
      { children.map(pId => (
        <ParamEditor key={pId} {...parameters[id]} />
      )) }
    </div>
  </Card>
);

export class ComponentCard extends PureComponent {
  static propTypes = {
    component: PropTypes.object.isRequired,
  };

  render() {
    const { component: { id, contract, subscriptions } } = this.props;

    return (
      <Card>
        <CardTitle title={componentLabels[id]} subtitle={`Id: ${id}`} />
        <Divider />
        <CardText>
          { JSON.stringify(subscriptions, null, 2) }
          <Divider />
          <ParamEditor {...contract} parameters={{}} />
        </CardText>
      </Card>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentCard);
