'use strict';
module.exports = () => {
  const config = {};

  /**
   * webpack build config
   * @property {Number} port - webpack dev server port
   * @property {Object} proxy -  static resource http relative path mapping to true path @see https://github.com/popomore/koa-proxy
   *                    /public/client/js/vendor.js -> http://ip:port//public/client/js/vendor.js   
   * @property {Object} proxyMapping  support proxy mapping, default js/css/json, not support image
   * @property {Array} [webpackConfigList] - webpack building config
   */
  config.webpack = {
    port: 9000,
    proxy: {
      host: 'http://127.0.0.1:9000', // target host that matched path will be proxy to
      match: /^\/public\//, // path pattern.
    },
    webpackConfigList: [],
  };

  return config;
};

