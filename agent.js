'use strict';
const WebpackServer = require('./lib/server');
module.exports = agent => {
  const config = agent.config.webpack;
  new WebpackServer(agent, config).start();
};

