// @flow
import React, { PureComponent, Fragment } from 'react';
import { createSelector } from 'reselect';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

import { getGameObjects } from 'Editor/modules/data';

import type { ReqFn } from 'Editor/aspects/GameObjectInterface';
import type { Id, Label, ComponentState, Component, Entity } from 'Editor/types';
import { POST, PUT } from 'App/dbAgent';

import ComponentCard from './ComponentCard';

const getComponents = getGameObjects('components');
const getEntities = getGameObjects('entities');
const getComponentStates = getGameObjects('componentStates');
const getId = (_, ownProps) => ownProps.id;
const getEntityComponentStates = (state, ownProps) => {
  const entityId = getId(state, ownProps);
  const allComponentStates = getComponentStates(state);

  return Object.keys(allComponentStates).reduce((total, csId) => (
    allComponentStates[csId].entityId === entityId
      ? Object.assign(total, { [csId]: allComponentStates[csId] })
      : total
  ), {});
};

const getEntity = createSelector([getEntities, getId], (entities, id) => entities[id]);

const mapStateToProps = (state, ownProps) => ({
  componentStates: getEntityComponentStates(state, ownProps),
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

const makeValidState = (state, contract) => Object.keys(contract).reduce((total, key) => (
  Object.assign(total, { [key]: state[key] })
), {});

type Props = {
  id: Id,
  componentStates: {
    [Id]: ComponentState
  },
  components: {
    [Id]: Component
  },
  entity?: Entity,
  request: ReqFn,
};

type State = {
  addingComponent: boolean,
};

export class EntityInspectorContainer extends PureComponent<Props, State> {
  props: Props;
  state: State;

  static defaultProps = {
    entity: {},
  };

  state = {
    addingComponent: false,
  }

  getCandidateLabelSet = (): Array<Label> => {
    const { components, componentStates } = this.props;
    const componentIds = Object.keys(componentStates).map(csId => (
      componentStates[csId].componentId)
    );
    const componentSet = new Set(componentIds);

    return Object.keys(components).reduce((total, key) => (
      componentSet.has(components[key].id)
        ? total
        : total.concat(key)
    ), []);
  }

  canBeActive = (componentId: Id) => {
    const { components, componentStates } = this.props;
    const componentSpec = components[componentId];
    const { contexts = [] } = componentSpec;
    const csByComponentIds = Object.keys(componentStates).reduce((total, csId) => (
      Object.assign(total, { [componentStates[csId].componentId]: componentStates[csId] })
    ), {});

    return contexts.every(cId => csByComponentIds[cId]);
  }

  setAdding = () => this.setState({ addingComponent: true })

  unsetAdding = () => this.setState({ addingComponent: false })

  addComponent = (componentId: Id) => {
    const { components, request, entity: { id: entityId } = {} } = this.props;
    if (!entityId) throw new Error('No fucking entity id in inspector!!!');
    const componentSpec = components[componentId];
    const { contract = {} } = componentSpec;
    const state = stateFromContract(contract || {});
    const active = this.canBeActive(componentId);

    return request({
      method: POST,
      service: 'componentStates',
      form: { entityId, state, componentId, active },
    }).then(this.unsetAdding);
  }

  updateComponentState = (options: ComponentState) => {
    const { componentId, id, state, active } = options;
    const { request, components: { [componentId]: { contract = {} } },
    } = this.props;

    return request({
      method: PUT,
      service: 'componentStates',
      form: { id, state: makeValidState(state, contract || {}), active },
    });
  }

  render() {
    const { entity: { label } = {}, components, componentStates } = this.props;
    const componentList = Object.keys(componentStates).map((csId) => {
      const componentState = componentStates[csId];
      const { contexts: context = [] } = components[componentState.componentId];
      const contexts = context.reduce((total, componentId) => {
        const cCsId = Object.keys(componentStates).find(ncsId =>
          componentStates[ncsId].componentId === componentId
        );

        if (!cCsId) return total;
        const { componentId: csCompId, state: csState } = componentStates[cCsId];
        const { label: csLabel } = components[csCompId];
        return Object.assign(total, { [csLabel]: csState });
      }, {});

      return { contexts, componentState: componentStates[csId] };
    });

    return (
      <div>
        <h3 style={{ margin: 0 }}>{ label }</h3>
        <Divider />
        { componentList.map(({ componentState, contexts }) => (
          <ComponentCard
            key={componentState.id}
            contexts={contexts}
            componentState={componentState}
            updateComponentState={this.updateComponentState}
            component={components[componentState.componentId]}
            canBeActive={this.canBeActive(componentState.componentId)}
          />
        )) }
        { this.state.addingComponent ? (
          <Fragment>
            <select
              onChange={event => (
                this.addComponent(event.target.value)
              )}
            >
              <option value="">Select Component</option>
              { this.getCandidateLabelSet().map(key => (
                <option key={key} value={components[key].id}>
                  {components[key].label}
                </option>
              ))}
            </select>
            <Button color="primary" title="Cancel" onClick={this.unsetAdding}>
              Cancel
            </Button>
          </Fragment>
        ) : (
          <Button color="primary" title="Add Component" onClick={this.setAdding}>
            <Icon>add box</Icon>
            Add Component
          </Button>
        ) }
      </div>
    );
  }
}

export default connect(mapStateToProps)(EntityInspectorContainer);
