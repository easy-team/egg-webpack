'use strict';

const webpack = require('webpack');
const koa = require('koa');
const cors = require('kcors');
const app = koa();
app.use(cors());
const Constant = require('./constant');

module.exports = agent => {
  const config = agent.config.webpack;
  const serverWebpackConfig = config.serverConfig;
  const compiler = webpack([serverWebpackConfig]);

  compiler.plugin('done', () => {
    agent.messenger.sendToApp(Constant.EVENT_WEBPACK_SERVER_BUILD_STATE, { state: true });
    agent.webpack_server_build_success = true;
  });

  const devMiddleware = require('koa-webpack-dev-middleware')(compiler, {
    publicPath: serverWebpackConfig.output.publicPath,
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

  app.use(devMiddleware);

  app.listen(config.port + 1, err => {
    if (!err) {
      // agent.logger.info(`start webpack server build service: ${Utils.getHost(config, 2, true)}`);
    }
  });

  agent.messenger.on(Constant.EVENT_WEBPACK_SERVER_BUILD_STATE, () => {
    agent.messenger.sendToApp(Constant.EVENT_WEBPACK_SERVER_BUILD_STATE, { state: agent.webpack_server_build_success });
  });

  agent.messenger.on(Constant.EVENT_WEBPACK_READ_SERVER_FILE_MEMORY, data => {
    const fileContent = Utils.readWebpackMemoryFile(compiler, data.filePath);
    if (fileContent) {
      agent.messenger.sendToApp(Constant.EVENT_WEBPACK_READ_SERVER_FILE_MEMORY_CONTENT, {
        fileContent,
      });
    } else {
      // agent.logger.error(`webpack server memory file[${data.filePath}] not exist!`);
      agent.messenger.sendToApp(Constant.EVENT_WEBPACK_READ_SERVER_FILE_MEMORY_CONTENT, {
        fileContent: '',
      });
    }
  });
};
