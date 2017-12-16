import { fail } from 'assert';

'use strict';

const WebpackTool = require('webpack-tool');
const utils = require('./utils');

exports.dll = (config, option, callback) => {
  if(config && config.useDll === false){
    callback();
  }else{
    const webpackTool = new WebpackTool();
    const webpackConfig = utils.getWebpackConfig(config, { onlyDll: true, baseDir: option.baseDir });
    if (webpackConfig) {
      webpackTool.build(webpackConfig, {}, callback);
    } else {
      callback();
    }
  }
};
