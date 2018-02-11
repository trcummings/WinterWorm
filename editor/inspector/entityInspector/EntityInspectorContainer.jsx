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

import { default as ComponentCard } from './ComponentCard';

const mapStateToProps = (state, ownProps) => ({
  entity: getSpecs(state)[ENTITIES][ownProps.id],
  inspectorEntity: getInspectorEntity(state, ownProps),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateEntity: setEntity,
}, dispatch);

const componentLabels = Object.keys(components).reduce((total, key) => ({
  ...total,
  [components[key].id]: components[key].label,
}), {});

const stateFromContract = (contract = {}) => (
  Object.keys(contract.param).reduce((total, key) => Object.assign(total, {
    [key]: contract.param[key].defaultsTo,
  }), {})
);

const styles = {
  button: {
    margin: 12,
  },
  // exampleImageInput: {
  //   cursor: 'pointer',
  //   position: 'absolute',
  //   top: 0,
  //   bottom: 0,
  //   right: 0,
  //   left: 0,
  //   width: '100%',
  //   opacity: 0,
  // },
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
    const componentSpec = components[componentLabels[id]];

    updateEntity({
      ...inspectorEntity,
      components: [
        ...inspectorEntity.components,
        { id, state: stateFromContract(componentSpec.contract) },
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
