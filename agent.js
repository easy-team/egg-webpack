'use strict';
const server = require('./lib/service/server');
module.exports = agent => {
  const config = agent.config.webpack;
  const port = config.port;
  if (config.clientConfig) {
    server(agent, {
      port,
      hot: true,
      type: 'client',
      webpackConfig: config.clientConfig,
    });
  }
  if (config.serverConfig) {
    server(agent, {
      port: port + 1,
      type: 'server',
      hot: false,
      webpackConfig: config.serverConfig,
    });
  }

  let buildServer = config.buildServer;
  if (buildServer) {
    buildServer = Array.isArray(buildServer) ? buildServer : [buildServer];
    buildServer.forEach((item, index) => {
      server(agent, Object.assign({ port: port + 2 + index }, item));
    });
  }
};

