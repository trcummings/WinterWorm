// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import Main from './Main';
import { configureStore } from './store';

const { store } = configureStore();
const theme = createMuiTheme();

document.addEventListener('DOMContentLoaded', () => {
  const id = 'root';
  const element = document.getElementById('root');
  if (!element) throw new Error(`couldn't find element with id: ${id}`);

  render(
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Main />
      </Provider>
    </MuiThemeProvider>,
    element
  );
});
