'use strict';
const WebpackTool = require('webpack-tool');
const Utils = require('./utils');
const Constant = require('./constant');
const build = require('./build');
class WebpackServer extends WebpackTool {
  constructor(agent, config) {
    super(config);
    this.agent = agent;
    this.port = Utils.getPort(config.port);
  }

  start() {
    build.dll(this.config, { baseDir: this.agent.baseDir }, () => {
      const compilers = this.dev(this.config.webpackConfigList, {}, () => {
        this.finish();
      });
      this.listen(compilers);
    });
  }

  finish() {
    this.agent.messenger.sendToApp(Constant.EVENT_WEBPACK_BUILD_STATE, { state: true, port: this.port });
    this.endTime = Date.now();
    console.log(`webpack build cost:${this.endTime - this.startTime}ms`);
    this.openBrowser();
  }

  listen(compilers) {
    this.agent.messenger.on(Constant.EVENT_WEBPACK_BUILD_STATE, () => {
      this.agent.messenger.sendToApp(Constant.EVENT_WEBPACK_BUILD_STATE, { state: this.ready, port: this.port });
    });

    this.agent.messenger.on(Constant.EVENT_WEBPACK_READ_FILE_MEMORY, data => {
      const filePath = data.filePath;
      const fileContent = Utils.readWebpackMemoryFile(compilers, filePath, data.fileName);
      this.agent.messenger.sendToApp(Constant.EVENT_WEBPACK_READ_FILE_MEMORY_CONTENT, {
        fileContent, filePath
      });
    });
  }

  openBrowser() {
    this.agent.messenger.sendToApp(Constant.EVENT_WEBPACK_OPEN_BROWSER);
  }
}

module.exports = WebpackServer;
