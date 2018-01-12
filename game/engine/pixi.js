// @flow
import {
  Application,
  Container,
  loader,
  Sprite,
  loaders,
} from 'pixi.js';
import { assoc, view, lensProp } from 'ramda';

import { RENDER_ENGINE } from './symbols';
import { isDev } from './util';

type ResourceSpec = {
  resourceName: string,
  animationNames: Array<string>
};

const { Resource } = loaders;

export const createRenderingEngine = () => {
  const app = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    autoStart: false,
  });
  const canvas = app.view;
  const renderer = app.renderer;
  const stage = app.stage;

  document.body.appendChild(canvas);

  return { canvas, stage, renderer, pixiLoader: loader };
};

const checkOptions = (options) => {
  let failCase;
  if (!options.renderer) failCase = 'renderer';
  if (!options.stage) failCase = 'stage';
  if (!options.pixiLoader) failCase = 'pixiLoader';
  if (!options.canvas) failCase = 'canvas';
  if (failCase) throw new Error(`cannot find ${failCase} in state.renderingEngine!`);
};

export const getRenderEngine = state => view(lensProp(RENDER_ENGINE), state);

export const setRenderEngine = (state, options) => {
  if (isDev()) checkOptions(options);
  return assoc(RENDER_ENGINE, options, state);
};

export const addChildMut = (stage, item) => {
  stage.addChild(item);
  return stage;
};

export const addChildAtMut = (stage, item, zIndex) => {
  stage.addChildAt(item, zIndex);
  return stage;
};

export const removeChildMut = (stage, item) => {
  stage.removeChild(item);
  return stage;
};

export const makeContainer = (children) => {
  const container = new Container();
  container.addChild(...children);
  return container;
};

const texturePathByFrame = (
  animName: string,
  loaderName: string,
  ext = 'png'
) => frame => (
  typeof frame === 'undefined' ?
    `${loaderName}/${animName}.${ext}` :
    `${loaderName}/${animName}_${frame}.${ext}`
);

const getTexture = (resources, animName, resourceName) => numFrame => (
  resources[texturePathByFrame(animName, resourceName)(numFrame)]
);

const makeSpriteList = (
  allTextures: Resource,
  animName: string,
  resourceName: string,
  numFrames: number,
): Array<Sprite> => {
  const textures = [];
  const getTextureAt = getTexture(allTextures, animName, resourceName);

  for (let i = 0; i < numFrames; i++) {
    const idx = numFrames === 1 ? undefined : (i + 1);
    const texture = getTextureAt(idx);

    textures.push(Sprite.from(texture));
  }
  return textures;
};

const makeAnimation =
  (specs, textures, name) =>
    ({ animation, nameMap }, animName, index) => {
      const { numFrames } = specs[animName];
      const sprites = makeSpriteList(textures, animName, name, numFrames);
      const spriteContainer = new Container();

      spriteContainer.addChild(...sprites);
      spriteContainer.renderable = false;

      animation.addChild(spriteContainer);

      return { animation, nameMap: Object.assign(nameMap, { [animName]: index }) };
    };

export const makeAnimations = (
  resources: Resource,
  resourceSpec: ResourceSpec
): Array<Sprite> => {
  const { resourceName, animationSpecs } = resourceSpec;
  const textures = resources[resourceName].textures;
  const animNames = Object.keys(animationSpecs);
  const animFn = makeAnimation(animationSpecs, textures, resourceName);

  return animNames.reduce(animFn, { animation: new Container(), nameMap: {} });
};
