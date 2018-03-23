class DBPlugin {
  constructor() {
    this.startTime = Date.now();
    this.prevTimestamps = {};

    this.onEmit = this.onEmit.bind(this);
  }

  apply(compiler) {
    compiler.plugin('emit', this.onEmit);
  }

  onEmit(compilation, cb) {
    const changedFiles = [];
    const timestamps = compilation.fileTimestamps;

    for (const entry of timestamps) {
      const [watchFile, currentTimeTouched] = entry;
      const lastTimeTouched = this.prevTimestamps[watchFile] || this.startTime;

      if (lastTimeTouched < currentTimeTouched) changedFiles.push(watchFile);
    }

    this.prevTimestamps = timestamps;

    cb();
  }
}

module.exports = DBPlugin;
