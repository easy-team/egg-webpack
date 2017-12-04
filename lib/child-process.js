'use strict';
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const WebpackTool = require('webpack-tool');
const utils = require('./utils');
let compiler, webpackTool;

process.on('message', m => {
  if (m.action === 'building') {
    const config = m.config;
    const option = m.option;
    const webpackToolConfig = { isServerBuild: true };
    const sTime = Date.now();
    const webpackConfig = utils.getWebpackConfig(config, option);
    console.log('---process getWebpackConfig cost:', Date.now() - sTime);
    webpackTool = new WebpackTool(webpackToolConfig);
    compiler = webpackTool.build(webpackConfig, () => {
      process.send({ action: 'done' });
    });
    webpackTool.createWebpackServer(compiler, {
      hot: webpackConfig.target !== 'node',
      port: webpackTool.config.port + option.index,
      publicPath: webpackConfig.output.publicPath,
    });
  } else if (m.action === 'file') {
    const filePath = m.filePath;
    const fileContent = utils.readWebpackMemoryFile([compiler], filePath);
    if (fileContent) {
      process.send({ action: 'file', fileContent, filePath });
    }
  } else if (m.action === 'done') {
    webpackTool.openBrowser(m.appPort);
  }
});



