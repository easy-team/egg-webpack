'use strict';
const path = require('path');
const fs = require('fs');
const Constant = require('./lib/constant');

function isBuildFinish(app) {
  return app.webpack_build_success;
}

module.exports = app => {

  app.use(function* (next) {

    if (isBuildFinish(app)) {
      yield* next;
    } else {
      const build = yield new Promise(resolve => {
        this.app.messenger.sendToAgent(Constant.EVENT_WEBPACK_BUILD_STATE, {
          webpackBuildCheck: true,
        });
        this.app.messenger.on(Constant.EVENT_WEBPACK_BUILD_STATE, data => {
          resolve(data);
        });
      });
      app.webpack_build_success = build.state;

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

  app.messenger.on(Constant.EVENT_WEBPACK_BUILD_STATE, data => {
    app.webpack_build_success = data.state;
  });
};
