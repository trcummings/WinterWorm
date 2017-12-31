import { loader } from 'pixi.js';

// Type Strings
const NotLoaded = 'imageLoader/NotLoaded';
const Loading = 'imageLoader/Loading';
const Loaded = 'imageLoader/Loaded';

// Actions
const UPDATE_PROGRESS = 'imageLoader/action/UPDATE_PROGRESS';
const IS_LOADED = 'imageLoader/action/IS_LOADED';

const initialImageLoaderModel = {
  path: null,
  progress: 0,
  loadingState: NotLoaded,
};

const update = state => (action) => {
  switch (action) {
    default: return state;
  }
};

const view = (state) => {

};

const imageLoader = ({ path }) => {
  const updateImageLoad = update({ path, ...initialImageLoaderModel });
  loader.add(path);
};


loader
  .add([
    'images/one.png',
    'images/two.png',
    'images/three.png',
  ])
  .on('progress', () => {})
  .load(() => {});
