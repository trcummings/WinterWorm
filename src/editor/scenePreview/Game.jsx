// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { makeInitialState, startGame } from 'Game/main';
import { createRenderingEngine } from 'Game/engine/pixi';
import { isDev } from 'Game/engine/util';
import { setUpFpsMeter } from 'Game/engine/utils/fpsMeterUtil';

import { type State as Store } from 'Editor/types';

const mapStateToProps = state => ({
  data: state.data,
});

type Props = {
  data: $PropertyType<Store, 'data'>
};

type State = {
  error: null | Error
};

export class Game extends PureComponent<Props, State> {
  wrapper: null | HTMLDivElement;
  canvas: HTMLCanvasElement;
  props: Props;

  state = {
    error: null,
  }

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  componentDidMount() {
    window.addEventListener('resize', this.setCanvasSize);

    const { data } = this.props;
    // get inner height of div & inner width
    // set height listeners
    if (!this.wrapper) return;
    const { height, width } = this.wrapper.getBoundingClientRect();

    // initialize game state with current data
    const { canvas, ...rest } = createRenderingEngine({ height, width });
    this.canvas = canvas;

    const initialState = makeInitialState({
      height,
      width,
      renderEngine: { canvas, ...rest },
    });

    // get back canvas from PIXI, & attach it to the dom
    if (this.wrapper) this.wrapper.appendChild(canvas);
    if (isDev()) setUpFpsMeter();
    startGame(initialState, data);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setCanvasSize);
  }

  setCanvasSize = () => {
    if (!this.wrapper) return;

    const { height, width } = this.wrapper.getBoundingClientRect();
    this.canvas.height = height;
    this.canvas.width = width;
  }

  render() {
    return (
      <div
        ref={ref => (this.wrapper = ref)}
        style={{ height: '100%', width: '100%' }}
      />
    );
  }
}

export default connect(mapStateToProps)(Game);
