import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import { loadConfigs } from './modules/loader';
import { isGameRunning, startGame, stopGame } from './modules/preview';

const mapStateToProps = state => ({
  isGameRunning: isGameRunning(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  runGame: startGame,
  haltGame: stopGame,
}, dispatch);

const START_GAME = 'START GAME';
const STOP_GAME = 'STOP GAME';

class Main extends PureComponent {
  render() {
    const { isGameRunning, runGame, haltGame } = this.props;
    const onClick = isGameRunning ? haltGame : runGame;
    const text = isGameRunning ? STOP_GAME : START_GAME;

    return (
      <div>
        <h1>Whadda hell... bulnosaur</h1>
        <button onClick={onClick}>{text}</button>
        <div>
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
