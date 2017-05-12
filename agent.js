'use strict';

module.exports = agent => {
  const config = agent.config.webpack;
  if (config.clientConfig) {
    require('./lib/service/client')(agent);
  }
  if (config.serverConfig) {
    require('./lib/service/server')(agent);
  }
};

