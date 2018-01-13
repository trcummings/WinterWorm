import meta from './meta';
import clearEventQueue from './clearEventQueue';
import render from './render';
import position from './position';
import boundingBox from './boundingBox';
import input from './input';
import inputDebug from './inputDebug';
import spriteLoader from './spriteLoader';
import animation from './animation';
import spriteRender from './spriteRender';
import ticker from './ticker';
import inputControl from './inputControl';

// map of all non-factory systems (to use them in setSceneSystemSpec,
// pass them in dynamically at run time using the fourth options parameter)
const systemMap = {
  [meta.id]: meta,
  [position.id]: position,
  [clearEventQueue.id]: clearEventQueue,
  [render.id]: render,
  [boundingBox.id]: boundingBox,
  [input.id]: input,
  [inputDebug.id]: inputDebug,
  [animation.id]: animation,
  [spriteRender.id]: spriteRender,
  [ticker.id]: ticker,
  [inputControl.id]: inputControl,
};

export {
  meta,
  position,
  clearEventQueue,
  render,
  boundingBox,
  input,
  inputDebug,
  systemMap,
  spriteLoader,
  animation,
  spriteRender,
  ticker,
  inputControl,
};
