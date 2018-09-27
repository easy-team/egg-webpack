'use strict';
const WebpackTool = require('webpack-tool');
const Utils = require('./utils');
const Constant = require('./constant');
const build = require('./build');
class WebpackServer extends WebpackTool {
  constructor(agent, config) {
    super(config);
    this.agent = agent;
    this.browser = config.browser;
    this.compilerCount = this.config.webpackConfigList.length;
    const cluster = this.agent.config.cluster;
    if (agent.options.port) {
      this.appPort = agent.options.port;
    } else if (cluster && cluster.listen && cluster.listen.port) {
      this.appPort = cluster.listen.port;
    } else {
      this.appPort = this.config.appPort || process.env.PORT || 7001;
    }
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
    if (/^https?/.test(this.browser)) {
      WebpackTool.utils.openBrowser(this.appPort, this.browser);
    } else if (this.browser === undefined || this.browser === true) {
      WebpackTool.utils.openBrowser(this.appPort);
    }
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
}

module.exports = WebpackServer;
