'use strict';
const path = require('path');
const fs = require('fs');
const WebpackTool = require('webpack-tool');
const proxy = require('./lib/proxy');
const utils = require('./lib/utils');
const Constant = require('./lib/constant');
module.exports = app => {
  app.use(function* (next) {
    if (app.WEBPACK_BUILD_READY) {
      yield* next;
    } else {
      if (app.WEBPACK_LOADING_TEXT) {
        this.body = app.WEBPACK_LOADING_TEXT;
      } else {
        const filePath = path.resolve(__dirname, './lib/template/loading.html');
        this.body = app.WEBPACK_LOADING_TEXT = fs.readFileSync(filePath, 'utf8');
      }
    }
  });

  app.messenger.setMaxListeners(app.config.webpack.maxListeners || 10000);
  app.messenger.on(Constant.EVENT_WEBPACK_BUILD_STATE, data => {
    app.WEBPACK_BUILD_READY = data.state;
    const config = app.config.webpack;
    const port = utils.getPort(data.port || config.port);
    if (config.proxy) {
      if (typeof config.proxy === 'boolean') {
        config.proxy = {
          host: `http://127.0.0.1:${port}`,
          match: /^\/public\//,
        };
      } else if (config.proxy.host) {
        config.proxy.host = config.proxy.host.replace(config.port, port);
      }
      app.use(proxy(config.proxy));
    }
  });

  app.messenger.on(Constant.EVENT_WEBPACK_OPEN_BROWSER, () => {
    const appPort = app.options.port;
    const browser = app.config.webpack.browser;
    if (/^https?/.test(browser)) {
      WebpackTool.utils.openBrowser(appPort, browser);
    } else if (this.browser === undefined || browser === true) {
      WebpackTool.utils.openBrowser(appPort);
    }
  });

  app.ready(() => {
    app.messenger.sendToAgent(Constant.EVENT_WEBPACK_BUILD_STATE);
  });
};
