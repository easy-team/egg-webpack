'use strict';
const path = require('path');

module.exports = app => {
  const config = {};

  /**
   * webpack build config
   * @property {Number} port - webpack dev server port
   * @property {Object} clientConfig - webpack client(browser run) building config
   * @property {Object} serverConfig - webpack server(node run) building config
   */
  config.webpack = {
    port: 8090,
    clientConfig: require(path.join(app.baseDir, 'build/easy/client.js')),
    serverConfig: require(path.join(app.baseDir, 'build/easy/server.js')),
  };

  return config;
};

