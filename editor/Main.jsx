// @flow
import React, { PureComponent } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle,
} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import GameControl from './aspects/GameControl';
import SceneControl from './aspects/SceneControl';
// import { components } from './constants';

const START_GAME = 'START GAME';
const STOP_GAME = 'STOP GAME';

// npm install --save-dev prop-types redux-saga reselect immutable

class Main extends PureComponent {
  render() {
    return (
      <div>
        <h4>Game Editor</h4>
        <div>
          <GameControl>
            { ({ isRunning, startGame, stopGame }) => (
              <button onClick={isRunning ? stopGame : startGame}>
                {isRunning ? STOP_GAME : START_GAME}
              </button>
            ) }
          </GameControl>
        </div>
        <SceneControl>
          {({ scenes, currentScene, setCurrentScene, addScene }) => (
            <Toolbar>
              <ToolbarGroup firstChild>
                <ToolbarTitle text="Scenes" />
                <ToolbarSeparator />
                <Tabs value={currentScene} onChange={setCurrentScene}>
                  { scenes.map(({ label, id }) => (
                    <Tab key={id} label={label} value={id} />
                  )) }
                </Tabs>
              </ToolbarGroup>
              <ToolbarGroup>
                <ToolbarSeparator />
                <IconButton tooltip="Add Scene" onClick={addScene}>
                  <FontIcon className="material-icons">add</FontIcon>
                </IconButton>
              </ToolbarGroup>
            </Toolbar>
          )}
        </SceneControl>
      </div>
    );
  }
}

export default Main;
