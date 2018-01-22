// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

type RootType = {
  store: {},
  history: {}
};

const Root = ({ store, history }: RootType) => (
  React.createElement(Provider, { store },
    React.createElement(ConnectedRouter, { history },
      React.createElement('div', 'hello warld lol')
    )
  )
  // <Provider store={store}>
  //   <ConnectedRouter history={history}>
  //     <div>hello warld lol</div>
  //   </ConnectedRouter>
  // </Provider>
);

export default Root;
