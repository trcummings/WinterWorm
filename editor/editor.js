import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Root from './Root';
import { configureStore, history } from './store';

document.addEventListener('DOMContentLoaded', () => {
  const store = configureStore();
  const getRoot = () => document.getElementById('root');

  render(
    React.createElement(AppContainer,
      React.createElement(Root, { store, history })
    ),
    getRoot()
  );
  // render(
  //   <AppContainer>
  //     <Root store={store} history={history} />
  //   </AppContainer>,
  //   getRoot()
  // );

  if (module.hot) {
    module.hot.accept('./Root', () => {
      const NextRoot = require('./Root'); // eslint-disable-line global-require
      render(
        React.createElement(AppContainer,
          React.createElement(NextRoot, { store, history })
        ),
        getRoot()
      );
      // render(
      //   <AppContainer>
      //     <NextRoot store={store} history={history} />
      //   </AppContainer>,
      //   getRoot()
      // );
    });
  }
});
