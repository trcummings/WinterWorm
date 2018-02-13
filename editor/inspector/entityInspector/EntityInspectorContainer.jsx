// @flow
import React, { PureComponent, Fragment } from 'react';
import { assocPath } from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import { components } from 'Editor/constants';
import { getSpecs } from 'Editor/modules/specs';
import { default as VerticalDivider } from 'Editor/components/VerticalDivider';
import { setEntity, getInspectorEntity } from 'Editor/modules/inspector/entityInspector';
import { default as MetaSpecControl } from 'Editor/aspects/MetaSpecControl';
import { ENTITIES } from 'Symbols';

import ComponentCard, { componentLabels } from './ComponentCard';

const mapStateToProps = (state, ownProps) => ({
  entity: getSpecs(state)[ENTITIES][ownProps.id],
  inspectorEntity: getInspectorEntity(state, ownProps),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateEntity: setEntity,
}, dispatch);

export const stateFromContract = (param = {}) => (
  Object.keys(param).reduce((total, key) => {
    const { defaultsTo, type, factory } = param[key];
    return Object.assign(total, {
      [key]: type === 'factory' && factory
        ? () => stateFromContract(factory)
        : defaultsTo,
    });
  }, {})
);

const styles = {
  button: {
    margin: 12,
  },
};


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
    this.revertEntity();
  }

  getCandidateLabelSet = () => {
    const { inspectorEntity: { components: entityComponents } } = this.props;
    const componentIds = entityComponents.map(({ id }) => id);
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
    const componentSpec = components[componentLabels[id]];
    const state = stateFromContract(componentSpec.contract.param);

    updateEntity({
      ...inspectorEntity,
      components: [
        ...inspectorEntity.components,
        { id, state },
      ],
    });
    this.unsetAdding();
  }

  updateComponentState = (index, state) => {
    const { updateEntity, inspectorEntity } = this.props;

    updateEntity(assocPath(['components', index, 'state'], state, inspectorEntity));
  }

  revertEntity = () => {
    const { updateEntity, entity } = this.props;
    updateEntity(entity);
  }

  render() {
    const {
      inspectorEntity,
      inspectorEntity: { id, label, components: componentList },
    } = this.props;

    return (
      <div>
        <VerticalDivider>
          <Subheader>{ label }</Subheader>
          <Subheader>{ id }</Subheader>
        </VerticalDivider>
        <Divider />
        <Subheader>components</Subheader>
        { componentList.map(({ id: cId, state }, index) => (
          <div key={cId}>
            <ComponentCard
              index={index}
              componentState={state}
              component={components[componentLabels[cId]]}
              updateComponentState={this.updateComponentState}
            />
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
        <Divider />
        <div>
          <RaisedButton
            styles={styles.button}
            onClick={this.revertEntity}
          >
            <FontIcon className="material-icons">
              restore page
            </FontIcon>
            Cancel
          </RaisedButton>
          <MetaSpecControl specType={ENTITIES}>
            { ({ setSpec }) => (
              <RaisedButton
                styles={styles.button}
                onClick={() => setSpec(inspectorEntity)}
              >
                <FontIcon className="material-icons">
                  done
                </FontIcon>
                Save
              </RaisedButton>
            ) }
          </MetaSpecControl>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityInspectorContainer);
