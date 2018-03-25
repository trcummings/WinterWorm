import React, { PureComponent, Fragment } from 'react';

import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import CssBaseline from 'material-ui/CssBaseline';
import Divider from 'material-ui/Divider';

import { default as GameObjectInterface } from './aspects/GameObjectInterface';

import { default as InspectorSwitch } from './inspector/InspectorSwitch';
import { default as Library } from './library/Entities';
import { default as ConfigProvider } from './ConfigProvider';
import { default as Game } from './scenePreview/Game';

const LIBRARY = 'Library';
const GAME_CONFIG = 'Game Config';
const INSPECTOR = 'Inspector';
const SCENE_EDITOR = 'Scene Editor';
const GAME_PREVIEW = 'Game Preview';

const HEADER_HEIGHT = '40px';

export default class Main extends PureComponent { // eslint-disable-line
  render() {
    return (
      <CssBaseline>
        <GameObjectInterface>
          { ({ request }) => (
            <ConfigProvider request={request}>
              { loaded => (
                <Grid container spacing={0}>
                  {loaded ? (
                    <Fragment>
                      <Grid key="header" item xs={12} style={{ height: HEADER_HEIGHT }}>
                        <div style={{ height: '100%', width: '100%' }} />
                      </Grid>
                      <Grid key="game" item xs={7}>
                        <div style={{ height: `calc(100vh - ${HEADER_HEIGHT})` }}>
                          <div style={{ height: '50%' }}>
                            <Typography component="h3">
                              {SCENE_EDITOR}
                            </Typography>
                            <Game />
                          </div>
                          <div style={{ height: '50%' }}>
                            <Typography component="h3">
                              {GAME_PREVIEW}
                            </Typography>
                          </div>
                        </div>
                      </Grid>
                      <Grid key="library" item xs={2}>
                        <div>
                          <Typography component="h3">
                            {LIBRARY}
                          </Typography>
                          <Divider />
                          <Library />
                        </div>
                        <div>
                          <Typography component="h3">
                            {GAME_CONFIG}
                          </Typography>
                          <Divider />
                        height and width options
                        initial scene
                        </div>
                      </Grid>
                      <Grid key="inspector" item xs={3}>
                        <Typography component="h3">
                          {INSPECTOR}
                        </Typography>
                        <Divider />
                        <InspectorSwitch />
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
      </CssBaseline>
    );
  }
}
