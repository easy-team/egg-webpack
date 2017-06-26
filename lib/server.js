'use strict';

const Utils = require('./utils');
const msg_build_state = 'webpack_build_state';
const msg_build_success = 'webpack_build_success';
const msg_read_file_memory = 'webpack_read_file_memory';
const msg_read_file_memory_content = 'webpack_read_file_memory_content';

const WebpackTool = require('webpack-tool');

class WebpackServer extends WebpackTool {
  constructor(agent, config) {
    super(Object.assign(config, { isServerBuild: true }));
    this.agent = agent;
    this.buildCount = 0;
    this.appPort = this.config.appPort || process.env.PORT || 7001;
    this.compilerCount = this.config.webpackConfigList.length;
  }

  start() {
    const compilers = [];
    this.config.webpackConfigList.forEach((webpackConfig, index) => {
      const compiler = this.build(webpackConfig);
      super.createWebpackServer(compiler, {
        hot: webpackConfig.target !== 'node',
        port: this.config.port + index + 1,
        publicPath: webpackConfig.output.publicPath,
      });
      compilers.push(compiler);
    });
    this.listen(compilers);
  }

  checkBuildState() {
    if (!this.buildState) {
      this.buildState = this.buildCount % this.compilerCount === 0;
      if (this.buildState) {
        this.openBrowser(this.appPort);
      }
    }
    return this.buildState;
  }


  build(webpackConfig) {
    return super.build(webpackConfig, () => {
      this.buildCount++;
      this.agent.messenger.sendToApp(msg_build_state, { state: this.checkBuildState() });
      this.agent[msg_build_success] = true;
    });
  }

  listen(compilers) {

    this.agent.messenger.on(msg_build_state, () => {
      this.agent.messenger.sendToApp(msg_build_state, { state: this.checkBuildState() });
    });

    this.agent.messenger.on(msg_read_file_memory, data => {
      const fileContent = Utils.readWebpackMemoryFile(compilers, data.filePath);
      this.agent.messenger.sendToApp(msg_read_file_memory_content, {
        fileContent,
      });
    });
  }
}

module.exports = WebpackServer;