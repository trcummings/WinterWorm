const webpack = require('webpack');
const path = require('path');
// const CircularDependencyPlugin = require('circular-dependency-plugin');
// const ClosureCompiler = require('google-closure-compiler-js').webpack;

// const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  context: __dirname,
  target: 'electron-main',
  devtool: 'inline-source-maps',
  entry: {
    app: './app/app.js',
    game: './game/game.js',
    editor: './editor/Editor.jsx',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './dist'),
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
            ],
          },
        },
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    alias: {
      Editor: path.resolve(__dirname, './editor/'),
      Game: path.resolve(__dirname, './game/'),
      App: path.resolve(__dirname, './app/'),
      Types: path.resolve(__dirname, './game/engine/types'),
      Symbols: path.resolve(__dirname, './game/engine/symbols'),
    },
    extensions: ['.js', '.jsx', '.css', '.json'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.DEBUG_GAME': JSON.stringify(process.env.DEBUG_GAME),
      'process.env.DEBUG_EDITOR': JSON.stringify(process.env.DEBUG_EDITOR),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.ASSET_PATH': JSON.stringify(path.resolve(__dirname, './game/assets')),
      'process.env.CONFIG_PATH': JSON.stringify(path.resolve(__dirname, './config')),
    }),
  // ]
  // plugins: isProd ? [
  //   new ClosureCompiler({
  //     options: {
  //       languageIn: 'ECMASCRIPT6',
  //       languageOut: 'ECMASCRIPT5',
  //       compilationLevel: 'ADVANCED',
  //       warningLevel: 'VERBOSE',
  //     },
  //   }),
  // ] : [
    // new CircularDependencyPlugin({
    //   // exclude detection of files based on a RegExp
    //   exclude: /a\.js|node_modules/,
    //   // add errors to webpack instead of warnings
    //   failOnError: true,
    //   // set the current working directory for displaying module paths
    //   cwd: process.cwd(),
    //   onDetected({ module: webpackModuleRecord, paths, compilation }) {
    //     // `paths` will be an Array of the relative module paths that make up the cycle
    //     // `module` will be the module record generated by webpack that caused the cycle
    //     compilation.errors.push(new Error(paths.join(' -> ')));
    //     compilation.errors.push(new Error(webpackModuleRecord));
    //   },
    // }),
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify('development'),
    //   'process.env.ASSET_PATH': JSON.stringify(path.resolve(__dirname, './game/assets')),
    //   'process.env.CONFIG_PATH': JSON.stringify(path.resolve(__dirname, './config')),
    // }),
  ],
};
