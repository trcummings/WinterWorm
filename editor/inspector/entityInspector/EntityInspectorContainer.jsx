// @flow
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Card from 'material-ui/Card';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import { components, symbols } from 'Editor/constants';
import { getSpecs } from 'Editor/modules/specs';
import { default as VerticalDivider } from 'Editor/components/VerticalDivider';

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

export class EntityInspectorContainer extends PureComponent {
  static propTypes = {
    // id: PropTypes.string.isRequired,
    inspectorEntity: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    updateEntity: PropTypes.func.isRequired,
  };

  state = {
    addingComponent: false,
  }

  componentWillMount() {
    const { updateEntity, entity } = this.props;
    updateEntity(entity);
  }

  getCandidateLabelSet = () => {
    const { inspectorEntity: { components: componentIds } } = this.props;
    const componentSet = new Set(...componentIds);
    return Object.keys(components).reduce((total, key) => (
      componentSet.has(components[key].id)
        ? total
        : total.concat(key)
    ), []);
  }

  setAdding = () => this.setState({ addingComponent: true })

  unsetAdding = () => this.setState({ addingComponent: false })

  addComponent = (id) => {
    const { updateEntity, inspectorEntity } = this.props;

    updateEntity({
      ...inspectorEntity,
      components: [...inspectorEntity.components, id],
    });
    this.unsetAdding();
  }

  render() {
    const { inspectorEntity: { id, label, components: componentIds } } = this.props;

    return (
      <div>
        <VerticalDivider>
          <Subheader>{ label }</Subheader>
          <Subheader>{ id }</Subheader>
        </VerticalDivider>
        <Divider />
        <Subheader>components</Subheader>
        { componentIds.map(cId => (
          <div key={cId}>
            { JSON.stringify(components[componentLabels[cId]], null, 2) }
          </div>
        )) }
        { this.state.addingComponent ? (
          <Fragment>
            <DropDownMenu value={1}>
              <MenuItem value={1} primaryText="Select Component" />
              { this.getCandidateLabelSet().map(key => (
                <MenuItem
                  key={key}
                  value={key}
                  onClick={() => this.addComponent(components[key].id)}
                  primaryText={components[key].label}
                />
              ))}
            </DropDownMenu>
            <FlatButton onClick={this.unsetAdding}>
              Cancel
            </FlatButton>
          </Fragment>
        ) : (
          <FlatButton onClick={this.setAdding}>
            <FontIcon className="material-icons">
              add box
            </FontIcon>
            Add Component
          </FlatButton>
        ) }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityInspectorContainer);
