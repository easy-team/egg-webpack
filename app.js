'use strict';
const path = require('path');
const fs = require('fs');
const Constant = require('./lib/constant');

module.exports = app => {

  console.log('-------------egg-webpack  000001-------');
  app.use(function* (next) {
    if (app.webpack_build_success) {
      yield* next;
    } else {
      if (app.webpack_loading_text) {
        this.body = app.webpack_loading_text;
      } else {
        const filePath = path.resolve(__dirname, './lib/template/loading.html');
        this.body = app.webpack_loading_text = fs.readFileSync(filePath, 'utf8');
      }
    }
  });

  if (app.config.webpack.proxy) {
    app.use(function* (next) {
      const ext = path.extname(this.url).toLocaleLowerCase().replace(/^\./, '');
      const proxyMapping = app.config.webpack.proxyMapping;
      const matched = Object.keys(proxyMapping).some(item => {
        return item === ext;
      });
      if (matched) {
        const filePath = path.join(this.app.baseDir, this.url);
        this.set('Content-Type', proxyMapping[ext]);
        this.body = yield app.webpack.fileSystem.readWebpackMemoryFile(filePath, this.url);
      } else {
        yield next;
      }
    });
  }

  app.messenger.on(Constant.EVENT_WEBPACK_BUILD_STATE, data => {
    app.webpack_build_success = data.state;
  });

  app.ready(() => {
    app.messenger.sendToAgent(Constant.EVENT_WEBPACK_BUILD_STATE);
  });
};
