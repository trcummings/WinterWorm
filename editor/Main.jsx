import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';

import { default as WindowFrame } from './containers/WindowFrame';

// import { default as Control } from './control/Control';
import { default as InspectorSwitch } from './inspector/InspectorSwitch';
import { default as Library } from './library/Library';
import { default as ConfigProvider } from './ConfigProvider';

import { CONTROL, LIBRARY, INSPECTOR } from './modules/windows';

export default class Main extends PureComponent { // eslint-disable-line
  render() {
    return (
      <div>
        <ConfigProvider>
          { loaded => (
            loaded ? (
              <div>
                <WindowFrame windowType={CONTROL}>
                  { /* <Control /> */ }
                  <div>control</div>
                </WindowFrame>
                <WindowFrame windowType={LIBRARY}>
                  <Library />
                </WindowFrame>
                <WindowFrame windowType={INSPECTOR}>
                  <InspectorSwitch />
                </WindowFrame>
              </div>
            ) : <CircularProgress size={60} thickness={7} />
          )}
        </ConfigProvider>
      </div>
    );
  }
}
