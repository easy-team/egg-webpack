'use strict';
const Utils = require('./lib/utils');
const WebpackServer = require('./lib/server');
const MultProcessWebpackServer = require('./lib/mult-process-server');
module.exports = agent => {
  agent.messenger.on('egg-ready', ({ port }) => {
    const config = agent.config.webpack;
    config.appPort = port;
    agent.messenger.setMaxListeners(config.maxListeners || 10000);
    // 兼容 Node 前端渲染只有一个 webpack 配置
    if (config.webpackConfigList && !Array.isArray(config.webpackConfigList)) {
      config.webpackConfigList = [config.webpackConfigList];
    }
    // webpack-tool not need proxy again
    const serverConfig = Object.assign({}, config, { proxy: false });
    if (Utils.isUseMultProcess(agent.baseDir, config)) {
      new MultProcessWebpackServer(agent, serverConfig).start();
    } else {
      new WebpackServer(agent, serverConfig).start();
    }
  });
};
