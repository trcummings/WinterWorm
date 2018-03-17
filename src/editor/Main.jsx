import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';

import { default as GameObjectInterface } from './aspects/GameObjectInterface';
import { default as Collapse } from './containers/Collapse';

import { default as Control } from './control/Control';
import { default as InspectorSwitch } from './inspector/InspectorSwitch';
import { default as Library } from './library/Library';
import { default as ConfigProvider } from './ConfigProvider';


const CONTROL = 'Control';
const LIBRARY = 'Library';
const INSPECTOR = 'Inspector';


export default class Main extends PureComponent { // eslint-disable-line
  render() {
    return (
      <div>
        <GameObjectInterface>
          { ({ request }) => (
            <ConfigProvider request={request}>
              { loaded => (
                loaded ? (
                  <div>
                    <Collapse name={CONTROL}>
                      <h3 style={{ padding: 0, margin: 0 }}>{INSPECTOR}</h3>
                      <Control />
                    </Collapse>
                    <Collapse name={LIBRARY}>
                      <h3 style={{ padding: 0, margin: 0 }}>{LIBRARY}</h3>
                      <Library />
                    </Collapse>
                    <Collapse name={INSPECTOR}>
                      <h3 style={{ padding: 0, margin: 0 }}>{INSPECTOR}</h3>
                      <InspectorSwitch />
                    </Collapse>
                  </div>
                ) : <CircularProgress size={60} thickness={7} />
              )}
            </ConfigProvider>
          ) }
        </GameObjectInterface>
      </div>
    );
  }
}
