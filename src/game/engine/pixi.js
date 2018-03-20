// @flow
// Convenience methods for dealing with PIXI.JS
import {
  autoDetectRenderer,
  Container,
  Sprite,
  loaders,
  WebGLRenderer,
} from 'pixi.js';
import { assoc, view, lensProp } from 'ramda';

import type {
  ResourceName,
  Animations,
  AnimName,
} from 'Editor/aspects/AssetAtlases';

import { RENDER_ENGINE } from './symbols';
import { isDev } from './util';


type ResourceSpec = {
  resourceName: ResourceName,
  animationSpecs: Animations
};

type RenderEngine = {
  canvas: HTMLCanvasElement,
  pixiLoader: loaders.Loader,
  stage: Container,
  renderer: WebGLRenderer,
};

const ASPECT_RATIO = 16 / 9;
const makeHeight = width => Math.floor((1 / ASPECT_RATIO) * width);
const makeWidth = height => Math.floor(ASPECT_RATIO * height);

type RenderDims = { rendererHeight: number, rendererWidth: number };
export type Dims =  { height: number, width: number };

export const makeRendererDims = ({ height, width }: Dims): RenderDims => {
  let rendererHeight = height;
  let rendererWidth = width;
  const aspectRatio = width / height;

  // too short, adjust accordingly
  if (aspectRatio > ASPECT_RATIO) rendererWidth = makeWidth(height);
  else rendererHeight = makeHeight(width);

  return { rendererHeight, rendererWidth };
};

const backgroundColor = 0x1099bb;
export const createRenderingEngine = ({
  height = 1080,
  width = 1920,
}: Dims): RenderEngine => {
  const options = { width, height, backgroundColor, antialias: true };
  const renderer = new autoDetectRenderer(options);
  const canvas = renderer.view;
  const stage = new Container();

  const scaleX = width / 1920;
  const scaleY = height / 1080;
  stage.scale.x = scaleX;
  stage.scale.y = scaleY;

  return { canvas, stage, renderer, pixiLoader: new loaders.Loader() };
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

export const addChildAtMut = (
  stage: Container,
  item: Container,
  zIndex: number
): Container => {
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

export const texturePathByFrame = (
  animName: AnimName,
  loaderName: ResourceName,
  ext: string = 'png'
) => (frame?: number) => (
  typeof frame === 'undefined' ?
    `${loaderName}/${animName}.${ext}` :
    `${loaderName}/${animName}_${frame}.${ext}`
);

const getTexture = (resources, animName, resourceName) => numFrame => (
  resources[texturePathByFrame(animName, resourceName)(numFrame)]
);

const makeSpriteList = (
  allTextures: loaders.Resource,
  animName: AnimName,
  resourceName: ResourceName,
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

type SpriteAnimation = {
  animation: Container,
  nameMap: {
    [AnimName]: number
  }
};

const makeAnimation =
  (specs, textures, name: ResourceName) =>
    ({ animation, nameMap }: SpriteAnimation, animName: AnimName, index: number) => {
      const { numFrames } = specs[animName];
      const sprites = makeSpriteList(textures, animName, name, numFrames);
      const spriteContainer = new Container();

      spriteContainer.addChild(...sprites);
      spriteContainer.renderable = false;

      animation.addChild(spriteContainer);

      return { animation, nameMap: Object.assign(nameMap, { [animName]: index }) };
    };

export const makeAnimations = (
  resources: loaders.Resource,
  resourceSpec: ResourceSpec
): SpriteAnimation => {
  const { resourceName, animationSpecs } = resourceSpec;
  const textures = resources[resourceName].textures;
  const animNames = Object.keys(animationSpecs);
  const animFn = makeAnimation(animationSpecs, textures, resourceName);

  return animNames.reduce(animFn, { animation: new Container(), nameMap: {} });
};
