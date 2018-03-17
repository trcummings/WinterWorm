import React, { PureComponent, Fragment } from 'react';

import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';

import { default as GameObjectInterface } from './aspects/GameObjectInterface';
import { default as Collapse } from './containers/Collapse';

// import { default as Control } from './control/Control';
import { default as InspectorSwitch } from './inspector/InspectorSwitch';
import { default as Library } from './library/Library';
import { default as ConfigProvider } from './ConfigProvider';

const LIBRARY = 'Library';
const INSPECTOR = 'Inspector';
const SCENE_EDITOR = 'Scene Editor';
const GAME_PREVIEW = 'Game Preview';

export default class Main extends PureComponent { // eslint-disable-line
  render() {
    return (
      <GameObjectInterface>
        { ({ request }) => (
          <ConfigProvider request={request}>
            { loaded => (
              <Grid container>
                {loaded ? (
                  <Fragment>
                    <Grid key="header" item xs={12}>
                      {/* <Control /> */}
                      control
                    </Grid>
                    <Grid key="game" item xs={7}>
                      <Collapse name={SCENE_EDITOR}>
                        <h3 style={{ padding: 0, margin: 0 }}>{SCENE_EDITOR}</h3>
                        <div>{SCENE_EDITOR}</div>
                      </Collapse>
                      <Collapse name={GAME_PREVIEW}>
                        <h3 style={{ padding: 0, margin: 0 }}>{GAME_PREVIEW}</h3>
                        <div>{GAME_PREVIEW}</div>
                      </Collapse>
                    </Grid>
                    <Grid key="library" item xs={2}>
                      <Collapse name={LIBRARY}>
                        <h3 style={{ padding: 0, margin: 0 }}>{LIBRARY}</h3>
                        <Library />
                      </Collapse>
                    </Grid>
                    <Grid key="inspector" item xs={3}>
                      <Collapse name={INSPECTOR}>
                        <h3 style={{ padding: 0, margin: 0 }}>{INSPECTOR}</h3>
                        <InspectorSwitch />
                      </Collapse>
                    </Grid>
                  </Fragment>
                ) : (
                  <Grid item xs={12}>
                    <CircularProgress size={60} thickness={7} />
                  </Grid>
                )}
              </Grid>
            )}
          </ConfigProvider>
        ) }
      </GameObjectInterface>
    );
  }
}
