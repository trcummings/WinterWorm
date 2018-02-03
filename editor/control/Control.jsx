// @flow
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Download from 'material-ui/svg-icons/file/file-download';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { default as GameControl } from '../aspects/GameControl';
import { default as FilesystemControl } from '../aspects/FilesystemControl';

export default class Control extends PureComponent { // eslint-disable-line
  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Fragment>
        <FilesystemControl>
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
        <GameControl>
          { ({ isRunning, startGame, stopGame }) => (
            <FlatButton onClick={() => (isRunning ? stopGame() : startGame())}>
              <FontIcon className="material-icons">
                {isRunning ? 'stop' : 'play_arrow'}
              </FontIcon>
            </FlatButton>
          ) }
        </GameControl>
        <FlatButton
          onClick={() => (
            this.context.store.dispatch({ type: 'REFRESH_GAME' })
          )}
        >
          <FontIcon className="material-icons">
            refresh
          </FontIcon>
        </FlatButton>
      </Fragment>
    );
  }
}
