'use strict';

const webpack = require('webpack');
const koa = require('koa');
const cors = require('kcors');
const app = koa();
app.use(cors());
const Constant = require('./constant');

module.exports = agent => {

  const config = agent.config.webpack;

  const webpackConfig = typeof config.clientConfig === 'string' ? require(config.clientConfig)(agent) : config.clientConfig;

  const compiler = webpack([ webpackConfig ]);

  compiler.plugin('done', compilation => {
    // Child extract-text-webpack-plugin:
    compilation.stats.forEach(stat => {
      stat.compilation.children = stat.compilation.children.filter(child => {
        return child.name !== 'extract-text-webpack-plugin';
      });
    });
    // Utils.saveManifest(compiler, projectDir);
    agent.messenger.sendToApp(Constant.EVENT_WEBPACK_SERVER_BUILD_STATE, { state: true });
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
      // agent.logger.info(`start webpack client build service: ${Utils.getHost(config, 2)}`);
    }
  });

  agent.messenger.on(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, () => {
    agent.messenger.sendToApp(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, { state: agent.webpack_client_build_success });
  });

  agent.messenger.on(Constant.EVENT_WEBPACK_READ_CLIENT_FILE_MEMORY, data => {
    const fileContent = agent.webpack.fileSystem.readWebpackMemoryFile(compiler, data.filePath);
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
