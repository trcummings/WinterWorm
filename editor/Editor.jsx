import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { lightBlue900, lightBlue700 } from 'material-ui/styles/colors';

import Main from './Main';
import { configureStore } from './store';

const { store } = configureStore();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: lightBlue900,
    accent1Color: lightBlue700,
  },
});

document.addEventListener('DOMContentLoaded', () => render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <Main />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
));
