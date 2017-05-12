'use strict';
const path = require('path');
const fs = require('fs');
const Constant = require('./lib/service/constant');

function isBuildFinish(app) {
  const config = app.config.webpack;
  if (config.serverConfig && config.clientConfig) {
    return app.webpack_server_build_success && app.webpack_client_build_success;
  }
  if (config.serverConfig) {
    return app.webpack_server_build_success;
  }
  if (config.clientConfig) {
    return app.webpack_server_build_success;
  }
  return true;
}

module.exports = app => {

  const config = app.config.webpack;

  app.use(function* (next) {

    if (isBuildFinish(app)) {
      yield* next;
    } else {
      if (config.serverConfig) {
        const serverData = yield new Promise(resolve => {
          this.app.messenger.sendToAgent(Constant.EVENT_WEBPACK_SERVER_BUILD_STATE, {
            webpackBuildCheck: true,
          });
          this.app.messenger.on(Constant.EVENT_WEBPACK_SERVER_BUILD_STATE, data => {
            resolve(data);
          });
        });
        app.webpack_server_build_success = serverData.state;
      }

      if (config.clientConfig) {
        const clientData = yield new Promise(resolve => {
          this.app.messenger.sendToAgent(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, {
            webpackBuildCheck: true,
          });
          this.app.messenger.on(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, data => {
            resolve(data);
          });
        });
        app.webpack_client_build_success = clientData.state;
      }

      if (isBuildFinish(app)) {
        yield* next;
      } else {
        if (app.webpack_loading_text) {
          this.body = app.webpack_loading_text;
        } else {
          const filePath = path.resolve(__dirname, './lib/template/loading.html');
          this.body = app.webpack_loading_text = fs.readFileSync(filePath, 'utf8');
        }
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
