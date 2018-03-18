const webpack = require('webpack');
const common = require('./common.config');
const { DIST_PATH } = require('./constants');

module.exports = Object.assign({}, common, {
  entry: {
    game: './src/game/game.js',
    editor: './src/editor/Editor.jsx',
    config: './src/config/Config.jsx',
  },
  devServer: {
    contentBase: DIST_PATH,
    hot: true,
    watchOptions: {
      watch: true,
    },
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    ...common.plugins,
  ],
});
