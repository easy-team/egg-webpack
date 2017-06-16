'use strict';
const path = require('path');
module.exports = () => {
  const config = {};

  /**
   * webpack build config
   * @property {Number} port - webpack dev server port
   * @property {Boolean} single - webpack dev server number
   * @property {Array} [webpackConfigList] - webpack building config
   */
  config.webpack = {
    port: 8090,
    webpackConfigList: [],
  };

  return config;
};

