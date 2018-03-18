const webpack = require('webpack');
const path = require('path');
const { ROOT_PATH, DIST_PATH } = require('./constants');

module.exports = {
  mode: 'development',
  context: ROOT_PATH,
  target: 'electron-main',
  devtool: 'inline-source-maps',
  output: {
    filename: '[name].js',
    path: DIST_PATH,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-flow',
              '@babel/preset-react',
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
              'transform-es2015-arrow-functions',
              '@babel/plugin-syntax-dynamic-import',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    alias: {
      Editor: path.resolve(ROOT_PATH, './src/editor'),
      Game: path.resolve(ROOT_PATH, './src/game'),
      App: path.resolve(ROOT_PATH, './src/app'),
      Config: path.resolve(ROOT_PATH, './src/config'),
      Engine: path.resolve(ROOT_PATH, './src/game/engine'),
      Types: path.resolve(ROOT_PATH, './src/game/engine/types'),
      Symbols: path.resolve(ROOT_PATH, './src/game/engine/symbols'),
    },
    extensions: ['.js', '.jsx', '.css', '.json'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.DEBUG_GAME': JSON.stringify(process.env.DEBUG_GAME),
      'process.env.DEBUG_EDITOR': JSON.stringify(process.env.DEBUG_EDITOR),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.SRC_PATH': JSON.stringify(path.resolve(ROOT_PATH, './src')),
      'process.env.ASSET_PATH': JSON.stringify(path.resolve(ROOT_PATH, './src/game/assets')),
      'process.env.GAME_OBJECT_SPECS': JSON.stringify(path.resolve(ROOT_PATH, './src/game/gameObjectSpecs')),
      'process.env.COMPONENT_SPEC_PATH': JSON.stringify(path.resolve(ROOT_PATH, './src/game/gameObjectSpecs/componentSpecs')),
      'process.env.SYSTEM_SPEC_PATH': JSON.stringify(path.resolve(ROOT_PATH, './src/game/gameObjectSpecs/systemSpecs')),
      'process.env.CONFIG_PATH': JSON.stringify(path.resolve(ROOT_PATH, './src/config')),
      'process.env.BACKEND_INDEX_PATH': JSON.stringify(path.resolve(ROOT_PATH, './src/backend/index.js')),
      'process.env.EDITOR_FILES_PATH': JSON.stringify(path.resolve(ROOT_PATH, './editorFiles')),
    }),
  ],
};
