'use strict';
const Utils = require('./lib/utils');
const WebpackServer = require('./lib/server');
const MultProcessWebpackServer = require('./lib/mult-process-server');
module.exports = agent => {
  agent.messenger.on('egg-ready', () => {
    const config = agent.config.webpack;
    // 兼容 Node 前端渲染只有一个 webpack 配置
    if (config.webpackConfigList && !Array.isArray(config.webpackConfigList)) {
      config.webpackConfigList = [config.webpackConfigList];
    }
    if (Utils.isUseMultProcess(agent.baseDir, config)) {
      new MultProcessWebpackServer(agent, config).start();
    } else {
      config.useDll = config.useDll || false;
      new WebpackServer(agent, config).start();
    }
  });
};
