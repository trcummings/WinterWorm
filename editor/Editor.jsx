import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Main from './Main';
import { configureStore } from './store';

const { store } = configureStore();

document.addEventListener('DOMContentLoaded', () => {
  render(
    <Provider store={store}>
      <Main />
    </Provider>,
    document.getElementById('root')
  );
});
