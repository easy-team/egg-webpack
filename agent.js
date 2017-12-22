'use strict';
const WebpackServer = require('./lib/server');
const MultProcessWebpackServer = require('./lib/mult-process-server');
module.exports = agent => {
  agent.messenger.on('egg-ready', () => {
    const config = agent.config.webpack;
    if (config.webpackConfigList && config.webpackConfigList.length) {
      config.useDll = config.useDll || false;
      new WebpackServer(agent, config).start();
    } else {
      new MultProcessWebpackServer(agent, config).start();
    }
  });
};
