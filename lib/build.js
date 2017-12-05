'use strict';

const WebpackTool = require('webpack-tool');
const utils = require('./utils');

exports.dll = (config, option, callback) => {
  const webpackTool = new WebpackTool();
  const webpackConfig = utils.getWebpackConfig(config, { onlyDll: true , baseDir: option.baseDir});
  if(webpackConfig){
    webpackTool.build(webpackConfig, {}, callback);
  }else{
   callback();
  }
};