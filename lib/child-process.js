'use strict';
const WebpackTool = require('webpack-tool');
const utils = require('./utils');
let compiler;

process.on('message', m => {
  if (m.action === 'building') {
    const config = m.config;
    const baseDir = m.baseDir;
    const target = m.target;
    const webpackConfig = utils.getWebpackConfig(config, { baseDir, target });
    const webpackTool = new WebpackTool();
    compiler = webpackTool.createWebpackCompiler(webpackConfig, () => {
      process.send({ action: 'done' });
    });
    webpackTool.createWebpackServer(compiler);
  } else if (m.action === 'file') {
    const filePath = m.filePath;
    const fileContent = utils.readWebpackMemoryFile([compiler], filePath);
    process.send({ action: 'file', fileContent, filePath });
  }
});
// 使用Control+C键，可以触发SIGINT信号
process.on('SIGINT', () => {
  process.exit(0);
});
process.on('SIGTERM', () => {
  process.exit(0);
});
