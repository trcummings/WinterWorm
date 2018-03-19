// @flow
import { PureComponent, type Node } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';

import { REQUEST_START, REQUEST_END } from 'App/actionTypes';
import { ADD_ENTITY, REMOVE_ENTITY, ADD_ENTITIES, REMOVE_ENTITIES } from 'Editor/modules/data';

type ReqOptions = {
  method: 'get' | 'post' | 'put' | 'delete',
  service: 'init' | 'entities' | 'components' | 'componentStates' | 'systems' | 'scenes',
  form?: mixed,
  query?: mixed,
  multiple?: boolean,
};

export type ReqFn = ReqOptions => Promise<mixed>;

type MaybeError = Error | null;

export type GameObjectAspect = {
  request: ReqOptions => Promise<mixed>,
  error: MaybeError,
};

type Props = {
  children: GameObjectAspect => mixed
};

type State = {
  error: MaybeError
};

export default class GameObjectInterface extends PureComponent<Props, State> {
  props: Props

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  state = { error: null };

  handleError = (error: MaybeError) => this.setState({ error });

  request: ReqFn = (options) => {
    const { method, service, form, query, multiple = false } = options;
    const dispatch = this.context.store.dispatch;
    let action;

    switch (method) {
      case 'get':
      case 'post':
      case 'put': {
        action = multiple ? ADD_ENTITIES : ADD_ENTITY;
        break;
      }
      case 'delete': {
        action = multiple ? REMOVE_ENTITIES : REMOVE_ENTITY;
        break;
      }
      default: {
        throw new Error('game object request missing method!');
      }
    }

    return new Promise((resolve) => {
      ipcRenderer.once(REQUEST_END, (_, response) => {
        const { error, data } = JSON.parse(response);
        if (error) return this.handleError(error);

        dispatch({ type: action, payload: data, meta: { service, multiple } });

        return resolve(data);
      });

      // get some logging output in the console
      dispatch({ type: 'REQUEST', meta: { method, uri: service, form, query, multiple } });

      ipcRenderer.send(REQUEST_START, { method, uri: service, form, query });
    });
  }

  render(): Node {
    const { error } = this.state;
    if (error) console.error(error);
    return this.props.children({ request: this.request, error });
  }
}
