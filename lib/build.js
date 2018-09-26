'use strict';

const WebpackTool = require('webpack-tool');
const utils = require('./utils');

exports.dll = (pluginConfig, option, callback) => {
  const cliConfig = utils.getWebpackConfigJSON(option.baseDir, pluginConfig);
  if (cliConfig.dll) {
    const webpackTool = new WebpackTool();
    const webpackConfig = utils.getWebpackConfig(pluginConfig, { onlyDll: true, baseDir: option.baseDir });
    if (webpackConfig) {
      webpackTool.build(webpackConfig, {}, callback);
    } else {
      callback();
    }
  } else {
    callback();
  }
};
