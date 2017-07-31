'use strict';
const WebpackServer = require('./lib/server');
module.exports = agent => {
  agent.messenger.on('egg-ready', () => {
    const config = agent.config.webpack;
    new WebpackServer(agent, config).start();
  });
};
