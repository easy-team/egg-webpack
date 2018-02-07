'use strict';
const path = require('path');
const fs = require('fs');
const Constant = require('./lib/constant');
const Utils = require('./lib/utils');

module.exports = app => {

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
      const url = this.url.split('?')[0];
      const ext = path.extname(url).toLocaleLowerCase().replace(/^\./, '');
      const proxyMapping = app.config.webpack.proxyMapping;
      const matched = Object.keys(proxyMapping).some(item => {
        return item === ext;
      });
      if (matched) {
        const filepath = Utils.normalizeProxyUrlFile(app, url);
        this.set('Content-Type', proxyMapping[ext]);
        const content = yield app.webpack.fileSystem.readWebpackMemoryFile(filepath, url, 'web');
        if (content) {
          this.body = content;
        } else {
          yield next;
        }
      } else {
        yield next;
      }
    });
  }
  const config = app.config.webpack;
  app.messenger.setMaxListeners(config.maxListeners || 10000);

  app.messenger.on(Constant.EVENT_WEBPACK_BUILD_STATE, data => {
    app.webpack_build_success = data.state;
  });

  app.ready(() => {
    app.messenger.sendToAgent(Constant.EVENT_WEBPACK_BUILD_STATE);
  });
};
