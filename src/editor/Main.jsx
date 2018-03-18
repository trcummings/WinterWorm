import React, { PureComponent, Fragment } from 'react';

import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import { default as GameObjectInterface } from './aspects/GameObjectInterface';
import { default as Collapse } from './containers/Collapse';

// import { default as Control } from './control/Control';
import { default as InspectorSwitch } from './inspector/InspectorSwitch';
import { default as Library } from './library/Library';
import { default as ConfigProvider } from './ConfigProvider';
import { default as Game } from './scenePreview/Game';

const LIBRARY = 'Library';
const GAME_CONFIG = 'Game Config';
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
              <Grid container spacing={0}>
                {loaded ? (
                  <Fragment>
                    <Grid key="header" item xs={12}>
                      {/* <Control /> */}
                      control
                    </Grid>
                    <Grid key="game" item xs={7}>
                      <div style={{ height: 'calc(100vh - 20px)' }}>
                        <div style={{ height: '50%' }}>
                          <Typography component="h3" style={{ padding: 0, margin: 0 }}>
                            {SCENE_EDITOR}
                          </Typography>
                          <Game />
                        </div>
                        <div style={{ height: '50%' }}>
                          <Typography component="h3" style={{ padding: 0, margin: 0 }}>
                            {GAME_PREVIEW}
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                    <Grid key="library" item xs={2}>
                      <Collapse name={LIBRARY}>
                        <Typography component="h3" style={{ padding: 0, margin: 0 }}>
                          {LIBRARY}
                        </Typography>
                        <Library />
                      </Collapse>
                      <Collapse name={GAME_CONFIG}>
                        <Typography component="h3" style={{ padding: 0, margin: 0 }}>
                          {GAME_CONFIG}
                        </Typography>
                        height and width options
                        initial scene
                      </Collapse>
                    </Grid>
                    <Grid key="inspector" item xs={3}>
                      <Collapse name={INSPECTOR}>
                        <Typography component="h3" style={{ padding: 0, margin: 0 }}>
                          {INSPECTOR}
                        </Typography>
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
