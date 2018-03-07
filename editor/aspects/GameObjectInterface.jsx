import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';

import { REQUEST_START, REQUEST_END } from 'App/actionTypes';
import { ADD_ENTITY, REMOVE_ENTITY } from 'Editor/modules/data';

export default class GameObjectInterface extends PureComponent {
  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  request = ({ method, service, form, query }) => {
    const dispatch = this.context.store.dispatch;
    let action;

    switch (method) {
      case 'get':
      case 'post':
      case 'put': {
        action = ADD_ENTITY;
        break;
      }
      case 'delete': {
        action = REMOVE_ENTITY;
        break;
      }
      default: {
        throw new Error('game object request missing method!');
      }
    }

    return new Promise((resolve) => {
      ipcRenderer.once(REQUEST_END, (_, response) => {
        const { error, data } = JSON.parse(response);
        if (error) throw new Error(error);

        dispatch({ type: action, payload: data, meta: { service } });

        resolve(data);
      });

      ipcRenderer.send(REQUEST_START, { method, uri: service, form, query });
    });
  }

  render() {
    return this.props.children({ request: this.request });
  }
}
