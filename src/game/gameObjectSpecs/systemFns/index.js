import clearEventQueue from './clearEventQueue';
import fpsTickEnd from './fpsTickEnd';
import fpsTickStart from './fpsTickStart';
import input from './input';
import loader from './loader';
import meta from './meta';
import physics from './physics';
import render from './render';
import ticker from './ticker';

const systemFns = {
  clearEventQueue,
  fpsTickEnd,
  fpsTickStart,
  input,
  loader,
  meta,
  physics,
  render,
  ticker,
};

export default systemFns;
