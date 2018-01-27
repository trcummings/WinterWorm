import spriteRender from './spriteRender';
import render from './render';
import clearEventQueue from './clearEventQueue';

const renderSystems = [
  spriteRender,
  render,
  clearEventQueue,
];

export default renderSystems;
