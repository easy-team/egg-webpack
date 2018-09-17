'use strict';
const path = require('path');
const fs = require('fs');
const proxy = require('./lib/proxy');
const Constant = require('./lib/constant');
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
  const config = app.config.webpack;
  if (config.proxy) {
    if (typeof config.proxy === 'boolean') {
      config.proxy = {
        host: 'http://127.0.0.1:9000',
        match: /^\/public\//,
      };
    }
    if (config.port && config.port !== 9000 && config.proxy.host) {
      config.proxy.host = config.proxy.host.replace(9000, config.port);
    }
    app.use(proxy(config.proxy));
  }
  app.messenger.setMaxListeners(config.maxListeners || 10000);

  app.messenger.on(Constant.EVENT_WEBPACK_BUILD_STATE, data => {
    app.webpack_build_success = data.state;
  });

  app.ready(() => {
    app.messenger.sendToAgent(Constant.EVENT_WEBPACK_BUILD_STATE);
  });
};
