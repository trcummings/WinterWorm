import React from 'react';
import { render } from 'react-dom';

import Main from './Main';

document.addEventListener('DOMContentLoaded', () => render(
  <Main />,
  document.getElementById('root')
));
