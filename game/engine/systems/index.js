import meta from './meta';
import clearEventQueue from './clearEventQueue';
import render from './render';
import graphicsRect from './graphicsRect';
import position from './position';
import boundingBox from './boundingBox';
import input from './input';
import inputDebug from './inputDebug';

const systemMap = {
  [meta.id]: meta,
  [position.id]: position,
  [clearEventQueue.id]: clearEventQueue,
  [graphicsRect.id]: graphicsRect,
  [render.id]: render,
  [boundingBox.id]: boundingBox,
  [input.id]: input,
  [inputDebug.id]: inputDebug,
};

export {
  meta,
  position,
  clearEventQueue,
  graphicsRect,
  render,
  boundingBox,
  input,
  inputDebug,
  systemMap,
};
