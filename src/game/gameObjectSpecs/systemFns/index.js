import clearEventQueue from './clearEventQueue';
import fpsTickEnd from './fpsTickEnd';
import fpsTickStart from './fpsTickStart';
import input from './input';
import loaders from './loaders';
import meta from './meta';
import physics from './physics';
import render from './render';
import ticker from './ticker';

const systemFns = {
  clearEventQueue,
  fpsTickEnd,
  fpsTickStart,
  input,
  loaders,
  meta,
  physics,
  render,
  ticker,
};

export default systemFns;
