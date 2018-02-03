// @flow
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle,
} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Download from 'material-ui/svg-icons/file/file-download';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import SnackbarControl from './SnackbarControl';

import { default as GameControl } from './aspects/GameControl';
import { default as FilesystemControl } from './aspects/FilesystemControl';

import { default as SceneControl } from './sceneComposer/SceneControl';
import SceneComposerContainer from './sceneComposer/SceneComposerContainer';
import AddSceneButton from './sceneComposer/AddSceneButton';

export default class Main extends PureComponent { // eslint-disable-line
  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  render() {
    console.log(this.context);
    return (
      <SnackbarControl>
        { ({ openSnackbar }) => (
          <div>
            <AppBar
              title="GameEditor"
              iconElementRight={
                <GameControl>
                  { ({ isRunning, startGame, stopGame }) => (
                    <FlatButton onClick={() => (isRunning ? stopGame() : startGame())}>
                      <FontIcon className="material-icons">
                        {isRunning ? 'stop' : 'play_arrow'}
                      </FontIcon>
                    </FlatButton>
                  ) }
                </GameControl>
              }
              iconElementLeft={
                <FilesystemControl openSnackbar={openSnackbar}>
                  { ({
                    isSaving,
                    saveGame,
                    savedFiles,
                    loadFile,
                    exportGameSpec,
                    exportConfig,
                  }) => (
                    <IconMenu
                      disabled={isSaving}
                      iconButtonElement={
                        <IconButton>
                          <MoreVertIcon />
                        </IconButton>
                      }
                    >
                      <MenuItem
                        onClick={saveGame}
                        leftIcon={<Download />}
                        primaryText="Save Game"
                      />
                      { savedFiles.length > 0 && (
                        <MenuItem
                          primaryText="Load Game"
                          menuItems={savedFiles.map(fileName => (
                            <MenuItem
                              key={fileName}
                              onClick={() => loadFile(fileName)}
                              primaryText={fileName}
                            />
                          ))}
                        />
                      ) }
                      <Divider />
                      <MenuItem
                        onClick={exportGameSpec}
                        leftIcon={
                          <FontIcon className="material-icons">
                            build
                          </FontIcon>
                        }
                        primaryText="Export Game Spec"
                      />
                      <MenuItem
                        onClick={exportConfig}
                        leftIcon={
                          <FontIcon className="material-icons">
                            save
                          </FontIcon>
                        }
                        primaryText="Export Config"
                      />
                    </IconMenu>
                  ) }
                </FilesystemControl>
              }
            />
            <SceneControl>
              {({ scenes, currentScene, setCurrentScene, setScene }) => (
                <Fragment>
                  <Toolbar>
                    <ToolbarGroup firstChild>
                      <ToolbarTitle text="Scenes" />
                      { Object.keys(scenes).length && (
                        <DropDownMenu
                          value={currentScene}
                          onChange={(event, _, value) => setCurrentScene(value)}
                        >
                          { Object.keys(scenes).map(id => (
                            <MenuItem key={id} primaryText={scenes[id].label} value={id} />
                          )) }
                        </DropDownMenu>
                      ) }
                    </ToolbarGroup>
                    <ToolbarGroup>
                      <ToolbarSeparator />
                      <AddSceneButton
                        numScenes={Object.keys(scenes).length}
                        setCurrentScene={setCurrentScene}
                        setScene={setScene}
                      />
                    </ToolbarGroup>
                  </Toolbar>
                  <div>
                    { currentScene && scenes[currentScene] && (
                      <SceneComposerContainer
                        scene={scenes[currentScene]}
                        setScene={setScene}
                      />
                    ) }
                  </div>
                </Fragment>
              )}
            </SceneControl>
            <FlatButton
              onClick={() => (
                this.context.store.dispatch({ type: 'REFRESH_GAME' })
              )}
            >
              <FontIcon className="material-icons">
                refresh
              </FontIcon>
            </FlatButton>
          </div>
        ) }
      </SnackbarControl>
    );
  }
}
