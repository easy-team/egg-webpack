'use strict';
const WebpackTool = require('webpack-tool');
const Utils = require('./utils');
const Constant = require('./constant');
const build = require('./build');
class WebpackServer extends WebpackTool {
  constructor(agent, config) {
    super(config);
    this.agent = agent;
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
    this.agent.messenger.sendToApp(Constant.EVENT_WEBPACK_BUILD_STATE, { state: true });
    this.endTime = Date.now();
    console.log(`webpack build cost:${this.endTime - this.startTime}ms`);
    this.openBrowser();
  }

  listen(compilers) {
    this.agent.messenger.on(Constant.EVENT_WEBPACK_BUILD_STATE, () => {
      this.agent.messenger.sendToApp(Constant.EVENT_WEBPACK_BUILD_STATE, { state: this.ready });
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
    const appPort = this.agent.options.port;
    const browser = this.config.browser;
    if (/^https?/.test(browser)) {
      WebpackTool.utils.openBrowser(appPort, browser);
    } else if (this.browser === undefined || browser === true) {
      WebpackTool.utils.openBrowser(appPort);
    }
  }
}

module.exports = WebpackServer;
