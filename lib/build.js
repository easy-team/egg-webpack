'use strict';

const WebpackTool = require('webpack-tool');
const utils = require('./utils');

exports.dll = (config, option, callback) => {
  const cliConfig = utils.getWebpackConfigJSON(option.baseDir, config);
  if (cliConfig && cliConfig.dll) {
    const webpackTool = new WebpackTool();
    const webpackConfig = utils.getWebpackConfig(config, { onlyDll: true, baseDir: option.baseDir
    });
    if (webpackConfig) {
      webpackTool.build(webpackConfig, {}, callback);
    } else {
      callback();
    }
  } else {
    callback();
  }
};
