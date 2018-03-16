// @flow
import { PureComponent, type Element } from 'react';
import { ipcRenderer } from 'electron';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { GET_EDITOR_CONFIG, RECEIVE_EDITOR_CONFIG } from 'App/actionTypes';

import type { ReqFn } from 'Editor/aspects/GameObjectInterface';

import { setEditorConfig } from './modules/editorConfig';

const mapDispatchToProps = dispatch => bindActionCreators({
  setConfig: setEditorConfig,
}, dispatch);

type Props = {
  setConfig: () => mixed,
  request: ReqFn,
  children: boolean => mixed,
};

type State = {
  entitiesLoaded: boolean,
};

export class ConfigProvider extends PureComponent<Props, State> {
  props: Props

  state = {
    entitiesLoaded: false,
  };

  componentDidMount() {
    ipcRenderer.on(RECEIVE_EDITOR_CONFIG, this.receiveEditorConfig);
    ipcRenderer.send(GET_EDITOR_CONFIG);
  }

  receiveEditorConfig = (_, resp) => {
    const { isNew, filename } = JSON.parse(resp);
    this.props.setConfig({ isNew, filename });
    this.fetchGameObjects()
      .then(() => this.setState(() => ({ entitiesLoaded: true })));
  }

  fetchGameObjects = () => (
    this.props.request({
      method: 'get',
      service: 'init',
      multiple: true,
    })
  )

  render(): Element<*> {
    const { entitiesLoaded } = this.state;
    return this.props.children(entitiesLoaded);
  }
}

export default connect(null, mapDispatchToProps)(ConfigProvider);
