const common = require('./common.config');

module.exports = Object.assign({}, common, {
  target: 'electron-main',
  entry: {
    app: './src/app/app.js',
  },
});
