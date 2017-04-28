'use strict';
const path = require('path');
const fs = require('fs');
const Constant = require('./lib/service/constant');

module.exports = app => {
  app.webpack_server_build_success = true;
  app.webpack_client_build_success = true;

  app.use(function* (next) {

    if (app.webpack_server_build_success && app.webpack_client_build_success) {
      yield* next;
    } else {
      const serverData = yield new Promise(resolve => {
        this.app.messenger.sendToAgent(Constant.EVENT_WEBPACK_SERVER_BUILD_STATE, {
          webpackBuildCheck: true,
        });
        this.app.messenger.on(Constant.EVENT_WEBPACK_SERVER_BUILD_STATE, data => {
          resolve(data);
        });
      });
      app.webpack_server_build_success = serverData.state;

      const clientData = yield new Promise(resolve => {
        this.app.messenger.sendToAgent(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, {
          webpackBuildCheck: true,
        });
        this.app.messenger.on(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, data => {
          resolve(data);
        });
      });

      app.webpack_client_build_success = clientData.state;

      if (!(app.webpack_server_build_success && app.webpack_client_build_success)) {
        if (app.webpack_loading_text) {
          this.body = app.webpack_loading_text;
        } else {
          const filePath = path.resolve(__dirname, './lib/template/loading.html');
          this.body = app.webpack_loading_text = fs.readFileSync(filePath, 'utf8');
        }
      } else {
        yield* next;
      }
    }
  });

  app.messenger.on(Constant.EVENT_WEBPACK_SERVER_BUILD_STATE, data => {
    app.webpack_server_build_success = data.state;
  });

  app.messenger.on(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, data => {
    app.webpack_client_build_success = data.state;
  });
};
