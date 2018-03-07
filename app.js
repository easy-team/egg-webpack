'use strict';
const path = require('path');
const fs = require('fs');
const Constant = require('./lib/constant');
module.exports = app => {
  const config = app.config.webpack;
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

  app.messenger.setMaxListeners(config.maxListeners || 10000);

  app.messenger.on(Constant.EVENT_WEBPACK_BUILD_STATE, data => {
    app.webpack_build_success = data.state;
  });

  app.ready(() => {
    app.messenger.sendToAgent(Constant.EVENT_WEBPACK_BUILD_STATE);
  });
};
