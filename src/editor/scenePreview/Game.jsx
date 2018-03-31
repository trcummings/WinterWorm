// @flow
import uuidv4 from 'uuid/v4';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { CAMERA_ZOOM } from 'Game/engine/symbols';
import { emitQueueEvent } from 'Editor/ipcUtil';
import { makeInitialState, startGame } from 'Game/main';
import { createRenderingEngine, makeRendererDims, type Dims } from 'Game/engine/pixi';
import { isDev } from 'Game/engine/util';
import { gameSpecsToSpecs } from 'Game/engine/specUtil';
import { setUpFpsMeter } from 'Game/engine/utils/fpsMeterUtil';

import type { State as Store, EntityId } from 'Editor/types';

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
  devCameraId: EntityId;
  props: Props;

  state = {
    error: null,
  }

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  handleCanvasScroll = (event: SyntheticWheelEvent<HTMLCanvasElement>) => {
    if (event.target !== this.canvas) return;
    const scrollScalar = event.deltaY / this.canvas.height;

    emitQueueEvent(scrollScalar, [CAMERA_ZOOM, this.devCameraId]);
  }

  componentDidMount() {
    window.addEventListener('resize', this.setCanvasSize);
    window.addEventListener('wheel', this.handleCanvasScroll);

    const { data } = this.props;
    // get inner height of div & inner width
    // set height listeners
    if (!this.wrapper) return;

    // initialize game state with current data
    const { canvas, ...rest } = createRenderingEngine(this.getWrapperDims());

    this.canvas = canvas;
    this.setCanvasSize();

    const initialState = makeInitialState({
      renderEngine: { canvas, ...rest },
    });

    // get back canvas from PIXI, & attach it to the dom
    if (this.wrapper) this.wrapper.appendChild(canvas);
    if (isDev()) setUpFpsMeter(false);

    const devCameraId = uuidv4();
    const dataOptions = gameSpecsToSpecs(data, devCameraId);

    this.devCameraId = devCameraId;

    startGame(initialState, dataOptions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setCanvasSize);
    window.removeEventListener('wheel', this.handleCanvasScroll);
  }

  getWrapperDims = (): Dims => {
    if (!this.wrapper) return { height: 0, width: 0 };

    const { height, width } = window.getComputedStyle(this.wrapper.parentElement);
    const { rendererHeight, rendererWidth } = makeRendererDims({
      height: parseInt(height, 10) - 32,
      width: parseInt(width, 10) - 32,
    });

    return { height: rendererHeight, width: rendererWidth };
  }

  setCanvasDims = ({ height, width }: Dims) => {
    if (!this.canvas || !height || !width) return;
    this.canvas.height = height;
    this.canvas.width = width;
    this.canvas.style.position = 'absolute';
    this.canvas.style.transform = 'translate(-50%, -50%)';
    this.canvas.style.top = '50%';
    this.canvas.style.left = '50%';
  }

  setCanvasSize = () => this.setCanvasDims(this.getWrapperDims());

  render() {
    return (
      <div
        ref={ref => (this.wrapper = ref)}
        style={{ height: 'calc(100% - 20px)', width: '100%', position: 'relative' }}
      />
    );
  }
}

export default connect(mapStateToProps)(Game);
