'use strict';
const WebpackTool = require('webpack-tool');
const utils = require('./utils');
let compiler;
let webpackTool;

process.on('message', m => {
  if (m.action === 'building') {
    const config = m.config;
    const option = m.option;
    const webpackToolConfig = { isServerBuild: true };
    let webpackConfig = utils.getWebpackConfig(config, option);
    if (Array.isArray(webpackConfig)) {
      webpackConfig = webpackConfig.find(item => {
        return item.target === option.target;
      });
    }
    if (webpackConfig) {
      webpackTool = new WebpackTool(webpackToolConfig);
      compiler = webpackTool.build(webpackConfig, () => {
        process.send({ action: 'done' });
      });
      webpackTool.createWebpackServer(compiler, {
        hot: webpackConfig.target !== 'node',
        port: webpackTool.config.port + option.index,
        publicPath: webpackConfig.output.publicPath,
      });
    } else {
      console.error('[egg-webpack] mult process webpack build get webpack config null', option);
    }
  } else if (m.action === 'file') {
    const filePath = m.filePath;
    const fileContent = utils.readWebpackMemoryFile([compiler], filePath);
    process.send({ action: 'file', fileContent, filePath });
  } else if (m.action === 'done') {
    webpackTool.openBrowser(m.appPort);
  }
});
