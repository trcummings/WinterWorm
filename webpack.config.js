const path = require('path');

module.exports = {
  context: __dirname,
  target: 'electron-main',
  devtool: 'inline-sourcemap',
  entry: {
    app: './app/app.js',
    game: './game/game.js',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-flow'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    modules: ['app', 'game', 'node_modules'],
  },
};
