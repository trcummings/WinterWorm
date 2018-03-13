//
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ipcRenderer } from 'electron';

import { OPEN_GAME_START, OPEN_GAME_FINISH } from 'App/actionTypes';

import { isGameRunning, startGame, stopGame } from '../modules/preview';

const mapStateToProps = state => ({
  isRunning: isGameRunning(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  runGame: startGame,
  haltGame: stopGame,
}, dispatch);

export class GameControl extends PureComponent {
  componentDidMount() {
    ipcRenderer.on(OPEN_GAME_FINISH, this.startGame);
    ipcRenderer.send(OPEN_GAME_START);
  }

  startGame = () => {
    const { isRunning, runGame } = this.props;

    if (!isRunning) runGame();
  }

  stopGame = () => {
    const { isRunning, haltGame } = this.props;

    if (isRunning) haltGame();
  }

  render() {
    const { isRunning, children } = this.props;

    return children({
      startGame: this.startGame,
      stopGame: this.stopGame,
      isRunning,
    });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameControl);
