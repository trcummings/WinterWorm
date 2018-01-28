// @flow
import React, { PureComponent, Fragment } from 'react';
import AppBar from 'material-ui/AppBar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
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

import { default as GameControl } from './aspects/GameControl';
import { default as FilesystemControl } from './aspects/FilesystemControl';
// import { components } from './constants';

import SceneControl from './sceneComposer/SceneControl';
import SceneComposerContainer from './sceneComposer/SceneComposerContainer';
import AddSceneButton from './sceneComposer/AddSceneButton';

const START_GAME = 'play_arrow';
const STOP_GAME = 'stop';

export default class Main extends PureComponent {
  render() {
    return (
      <div>
        <AppBar
          title="GameEditor"
          iconElementRight={
            <GameControl>
              { ({ isRunning, startGame, stopGame }) => (
                <FlatButton onClick={() => (isRunning ? stopGame() : startGame())}>
                  <FontIcon className="material-icons">
                    {isRunning ? STOP_GAME : START_GAME}
                  </FontIcon>
                </FlatButton>
              ) }
            </GameControl>
          }
          iconElementLeft={
            <FilesystemControl>
              { ({ isSaving, saveGame, savedFiles, loadFile }) => (
                <IconMenu
                  disabled={isSaving}
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
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
      </div>
    );
  }
}
