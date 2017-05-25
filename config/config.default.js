'use strict';
const fs = require('fs');
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
  };

  const clientConfigPath = path.join(app.baseDir, 'build/client');

  if (fs.existsSync(`${clientConfigPath}.js`) || fs.existsSync(`${clientConfigPath}/index.js`)) {
    config.webpack.clientConfig = require(path.join(app.baseDir, 'build/client'));
  }

  const serverConfigPath = path.join(app.baseDir, 'build/server');

  if (fs.existsSync(`${serverConfigPath}.js`) || fs.existsSync(`${serverConfigPath}/index.js`)) {
    config.webpack.serverConfig = require(path.join(app.baseDir, 'build/server'));
  }

  return config;
};

