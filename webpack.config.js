const DefinePlugin = require('webpack').DefinePlugin;
const path = require('path');

module.exports = {
  context: __dirname,
  target: 'electron-main',
  devtool: 'inline-sourcemap',
  entry: './main.js',
  output: {
    filename: 'bundle.js',
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
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env.INDEX_PATH': JSON.stringify(path.join(__dirname, 'index.html')),
    }),
  ],
};
