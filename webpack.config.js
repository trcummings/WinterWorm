const path = require('path');
const ClosureCompiler = require('google-closure-compiler-js').webpack;

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  context: __dirname,
  target: 'electron-main',
  devtool: 'inline-source-maps',
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
  plugins: isProd ? [
    new ClosureCompiler({
      options: {
        languageIn: 'ECMASCRIPT6',
        languageOut: 'ECMASCRIPT5',
        compilationLevel: 'ADVANCED',
        warningLevel: 'VERBOSE',
      },
    }),
  ] : [],
};
