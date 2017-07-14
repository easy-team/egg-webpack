'use strict';
module.exports = () => {
  const config = {};

  /**
   * webpack build config
   * @property {Number} port - webpack dev server port
   * @property {Boolean} proxy - js/css static resource http absolution path  mapping to relative path
   *                    http://ip:port//public/client/js/vendor.js ->  /public/client/js/vendor.js
   * @property {Object} proxyMapping  support proxy mapping, default js/css/json, not support image
   * @property {Array} [webpackConfigList] - webpack building config
   */
  config.webpack = {
    port: 9000,
    proxy: true,
    proxyMapping: {
      js: 'text/javascript',
      css: 'text/css',
      json: 'application/json'
    },
    webpackConfigList: [],
  };

  return config;
};

