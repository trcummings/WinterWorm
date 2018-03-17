// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Main from './Main';
import { configureStore } from './store';

const { store } = configureStore();

document.addEventListener('DOMContentLoaded', () => {
  const id = 'root';
  const element = document.getElementById('root');
  if (!element) throw new Error(`couldn't find element with id: ${id}`);

  render(<Provider store={store}><Main /></Provider>, element);
});
