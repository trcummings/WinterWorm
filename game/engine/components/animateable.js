// @flow
import { makeId } from '../util';
import { COMPONENTS } from '../symbols';

import type { Component } from '../types';

const texturePathByFrame = (loaderName, animName, ext = 'png') => frame => (
  `${loaderName}/${animName}_${frame}.${ext}`
);

const makeTextureList = (allTextures, texturePathFn, numFrames) => {
  const textures = [];
  for (let i = 0; i < numFrames; i++) {
    textures.push(allTextures[texturePathFn(i + 1)]);
  }
  return textures;
};

const loaderName = 'player';
const atlasPath = './assets/player/player.json';
const animName = 'walk_l';
const numFrames = 2;
