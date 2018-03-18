// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import Main from './Main';
import { configureStore } from './store';

const { store } = configureStore();
const theme = createMuiTheme({
  palette: {
    typography: {
      fontSize: 12,
    },
    common: {
      black: '#1B1C18',
      white: '#fafafa',
    },
    secondary: {
      light: '#71668d',
      main: '#453c60',
      dark: '#1c1636',
      contrastText: '#ededed',
    },
    primary: {
      light: '#42433e',
      main: '#1b1c18',
      dark: '#000000',
      contrastText: '#fafafa',
    },
    background: {
      default: '#fff',
      paper: '#fafafa',
    },
  },
});

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
