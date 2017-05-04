'use strict';

const webpack = require('webpack');
const koa = require('koa');
const cors = require('kcors');
const app = koa();
app.use(cors());
const Constant = require('./constant');
const Utils = require('./utils');

module.exports = agent => {

  const config = agent.config.webpack;
  const webpackConfig = config.clientConfig;
  const compiler = webpack([webpackConfig]);

  compiler.plugin('done', compilation => {
    // Child extract-text-webpack-plugin:
    compilation.stats.forEach(stat => {
      stat.compilation.children = stat.compilation.children.filter(child => {
        return child.name !== 'extract-text-webpack-plugin';
      });
    });
    agent.messenger.sendToApp(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, { state: true });
    agent.webpack_client_build_success = true;
  });

  const devMiddleware = require('koa-webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      children: true,
      modules: false,
      chunks: false,
      chunkModules: false,
    },
    watchOptions: {
      ignored: /node_modules/,
    },
  });

  const hotMiddleware = require('koa-webpack-hot-middleware')(compiler, {
    log: false,
    reload: true,
  });

  app.use(devMiddleware);
  app.use(hotMiddleware);

  app.listen(config.port, err => {
    if (!err) {
      agent.logger.info(`start webpack client build service: http://127.0.0.1:${config.port}`);
    }
  });

  agent.messenger.on(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, () => {
    agent.messenger.sendToApp(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, { state: agent.webpack_client_build_success });
  });

  agent.messenger.on(Constant.EVENT_WEBPACK_READ_CLIENT_FILE_MEMORY, data => {
    const fileContent = Utils.readWebpackMemoryFile(compiler, data.filePath);
    if (fileContent) {
      agent.messenger.sendToApp(Constant.EVENT_WEBPACK_READ_CLIENT_FILE_MEMORY_CONTENT, {
        fileContent,
      });
    } else {
      agent.logger.error(`webpack client memory file[${data.filePath}] not exist!`);
      agent.messenger.sendToApp(Constant.EVENT_WEBPACK_READ_CLIENT_FILE_MEMORY_CONTENT, {
        fileContent: '',
      });
    }
  });
};
