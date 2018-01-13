import meta from './meta';
import clearEventQueue from './clearEventQueue';
import render from './render';
import position from './position';
import input from './input';
import spriteLoader from './spriteLoader';
import animation from './animation';
import spriteRender from './spriteRender';
import ticker from './ticker';
import inputControl from './inputControl';
import acceleration from './acceleration';
import movement from './movement';

// map of all non-factory systems (to use them in setSceneSystemSpec,
// pass them in dynamically at run time using the fourth options parameter)
const systemMap = {
  [meta.id]: meta,
  [position.id]: position,
  [clearEventQueue.id]: clearEventQueue,
  [render.id]: render,
  [input.id]: input,
  [animation.id]: animation,
  [spriteRender.id]: spriteRender,
  [ticker.id]: ticker,
  [inputControl.id]: inputControl,
  [acceleration.id]: acceleration,
  [movement.id]: movement,
};

export {
  meta,
  position,
  clearEventQueue,
  render,
  input,
  systemMap,
  spriteLoader,
  animation,
  spriteRender,
  ticker,
  inputControl,
  acceleration,
  movement,
};
