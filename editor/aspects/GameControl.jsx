// @flow
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isGameRunning, startGame, stopGame } from '../modules/preview';

const mapStateToProps = state => ({
  isRunning: isGameRunning(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  runGame: startGame,
  haltGame: stopGame,
}, dispatch);

// const START_GAME = 'START GAME';
// const STOP_GAME = 'STOP GAME';

// npm install --save-dev prop-types redux-saga

export class GameControlUndec extends PureComponent {
  render() {
    const { isRunning, runGame, haltGame, children } = this.props;
    return children({ startGame: runGame, stopGame: haltGame, isRunning });
  }
}

const GameControl = connect(mapStateToProps, mapDispatchToProps)(GameControlUndec);
GameControl.displayName = 'GameControl';

export default GameControl;
