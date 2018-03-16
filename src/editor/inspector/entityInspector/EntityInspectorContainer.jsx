import React, { PureComponent, Fragment } from 'react';
import { createSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import { default as VerticalDivider } from 'Editor/components/VerticalDivider';
import { getGameObjects } from 'Editor/modules/data';

import ComponentCard from './ComponentCard';

const getComponents = getGameObjects('components');
const getEntities = getGameObjects('entities');
const getComponentStates = getGameObjects('componentStates');
const getId = (_, ownProps) => ownProps.id;
const getEntity = createSelector([getEntities, getId], (entities, id) => entities[id]);

const mapStateToProps = (state, ownProps) => ({
  componentStates: getComponentStates(state, ownProps),
  components: getComponents(state, ownProps),
  entity: getEntity(state, ownProps),
});

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

export class EntityInspectorContainer extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    componentStates: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    request: PropTypes.func.isRequired,
  };

  state = {
    addingComponent: false,
  }

  getCandidateLabelSet = () => {
    const { components = [], entity } = this.props;
    const entityComponents = this.getComponentStates(entity.id);
    const componentIds = entityComponents.map(({ id }) => id);
    const componentSet = new Set(...componentIds);

    return Object.keys(components).reduce((total, key) => (
      componentSet.has(components[key].id)
        ? total
        : total.concat(key)
    ), []);
  }

  getComponentStates = (id) => {
    const { componentStates } = this.props;
    return Object.keys(this.props.componentStates)
      .filter(csId => componentStates[csId].entityId === id)
      .map((csId) => {
        const { [csId]: { state, componentId } } = componentStates;
        return { id: componentId, state };
      });
  }

  setAdding = () => this.setState({ addingComponent: true })

  unsetAdding = () => this.setState({ addingComponent: false })

  addComponent = (componentId) => {
    const { components } = this.props;
    const componentSpec = components[componentId];
    const contract = componentSpec.contract || {};
    const state = stateFromContract(contract);
    return this.updateComponentState(0, componentId, state)
      .then(this.unsetAdding);
  }

  updateComponentState = (index, componentId, state) => {
    const { request, id: entityId } = this.props;
    return request({
      method: 'put',
      service: 'componentStates',
      form: { entityId, state, componentId },
    });
  }

  render() {
    const { entity: { id, label }, components } = this.props;
    const componentList = this.getComponentStates(id);

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
              component={components[cId]}
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
      </div>
    );
  }
}

export default connect(mapStateToProps)(EntityInspectorContainer);