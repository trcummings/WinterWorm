// @flow
import React, { PureComponent } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle,
} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';

import { default as GameControl } from './aspects/GameControl';
// import { components } from './constants';

import SceneControl from './sceneComposer/SceneControl';
import SceneComposerContainer from './sceneComposer/SceneComposerContainer';
import AddSceneButton from './sceneComposer/AddSceneButton';

const START_GAME = 'START GAME';
const STOP_GAME = 'STOP GAME';

export default class Main extends PureComponent {
  render() {
    return (
      <div>
        <div>
          <h4>Game Editor</h4>
          <GameControl>
            { ({ isRunning, startGame, stopGame }) => (
              <RaisedButton onClick={() => (isRunning ? stopGame() : startGame())}>
                {isRunning ? STOP_GAME : START_GAME}
              </RaisedButton>
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
                  { Object.keys(scenes).map(id => (
                    <Tab key={id} label={scenes[id].label} value={id}>
                      <SceneComposerContainer
                        label={scenes[id].label}
                        id={id}
                      />
                    </Tab>
                  )) }
                </Tabs>
              </ToolbarGroup>
              <ToolbarGroup>
                <ToolbarSeparator />
                <AddSceneButton
                  numScenes={Object.keys(scenes).length}
                  setCurrentScene={setCurrentScene}
                  addScene={addScene}
                />
              </ToolbarGroup>
            </Toolbar>
          )}
        </SceneControl>
      </div>
    );
  }
}
