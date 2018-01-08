import { Graphics, Application, Text, loader } from 'pixi.js';
import { assoc, view, lensProp } from 'ramda';

import { RENDER_ENGINE } from './symbols';
import { isDev } from './util';

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

// const alterSpriteMut = (sprite, ...alterations) => {
  // (defn alter-obj!
  //   "Alter a js object's fields. Returns the object.
  //    Example:
  //    (alter-obj! s  \"x\" 1 \"y\" 2)"
  //   [sprite & alterations]
  //   (doseq [[k v] (partition 2 alterations)]
  //     (aset sprite k v))
  //   sprite)
// };

export const makeGraphics = () => new Graphics();

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

// Set the frame of the sprite's spritesheet coords and dimensions
// Returns the updated sprite.
// Args:
// - sprite: a Pixi Sprite obj
// - frame: a vector of pos-x, pos-y, width, height of a spritesheet
// const setSpriteFrameMut = (pixiSprite, frame) => {
//   const [x, y, w, h] = frame;
//   const texture = pixiSprite.texture;
//   const bounds = new PIXI.rectangle(x, y, w, h);
//   texture.frame = bounds;
//   return pixiSprite;
// };
//
// const setSpriteZIndexMut = (pixiSprite, zIdx) => {
//   pixiSprite.position.z = zIdx;
//   return pixiSprite;
// };

// (defn mk-sprite-from-cache!
//   "Returns a sprite that has been added to the stage. The image for the sprite
//    is loaded from the cache. If a frame is not passed in the sprite will not
//    be visible until the frame is set. See set-sprite-frame! for more info.
//    Args:
//    - stage: a Pixi stage object
//    - loader: a Pixi.loader object
//    - image-location: a path to the image to use for the sprite
//    Optional args:
//    - frame: a vector of x, y, w, h in relation to the sprite image
//    - z-index: the z dimension when drawing the sprite"
//   ([stage loader image-location]
//    (mk-sprite-from-cache! stage loader image-location [0 0 0 0] 0))
//   ([stage loader image-location frame z-index]
//    (let [cached-texture (.-texture (aget (.-resources loader) image-location))
//          texture (new js/PIXI.Texture (.-baseTexture cached-texture))
//          sprite (new js/PIXI.Sprite texture)]
//      (set-sprite-frame! sprite frame)
//      (set-sprite-zindex! sprite z-index)
//      (add-child! stage sprite)
//      sprite)))

// const loadAssets = (loader, cb) => {
//   loader.load(cb);
// }

// renders a PIXI Stage object
export const renderMut = (renderer, stage) => {
  renderer.render(stage);
};

export const makeTextMut = (stage, text) => {
  const textObj = new Text(text);
  addChildMut(stage, textObj);
  return textObj;
};
