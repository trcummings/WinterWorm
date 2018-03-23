const common = require('./common.config');
const fs = require('fs');

const nodeModules = {};

fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => {
    nodeModules[mod] = `commonjs ${mod}`;
  });

module.exports = Object.assign({}, common, {
  target: 'node',
  entry: {
    backend: './src/backend/index.js',
  },
  externals: nodeModules,
});
