'use strict';

const webpack = require('webpack');
const koa = require('koa');
const cors = require('kcors');
const app = koa();
app.use(cors());
const Utils = require('./utils');

module.exports = (agent, config) => {

  const type = config.type;
  const port = config.port;
  const hot = config.hot;
  const webpackConfig = config.webpackConfig;
  const compiler = webpack([webpackConfig]);
  const msg_build_state = `webpack_${type}_build_state`;
  const msg_build_success = `webpack_${type}_build_success`;
  const msg_read_file_memory = `webpack_read_${type}_file_memory`;
  const msg_read_file_memory_content = `webpack_read_${type}_file_memory_content`;

  compiler.plugin('done', compilation => {
    // Child extract-text-webpack-plugin:
    compilation.stats.forEach(stat => {
      stat.compilation.children = stat.compilation.children.filter(child => {
        return child.name !== 'extract-text-webpack-plugin';
      });
    });
    agent.messenger.sendToApp(msg_build_state, { state: true });
    agent[msg_build_success] = true;
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

  app.use(devMiddleware);

  if (hot === undefined || hot) {
    const hotMiddleware = require('koa-webpack-hot-middleware')(compiler, {
      log: false,
      reload: true,
    });
    app.use(hotMiddleware);
  }


  app.listen(port, err => {
    if (!err) {
      agent.logger.info(`start webpack ${type} build service: http://127.0.0.1:${port}`);
    }
  });

  agent.messenger.on(msg_build_state, () => {
    agent.messenger.sendToApp(msg_build_state, { state: agent[msg_build_success] });
  });

  agent.messenger.on(msg_read_file_memory, data => {
    const fileContent = Utils.readWebpackMemoryFile(compiler, data.filePath);
    if (fileContent) {
      agent.messenger.sendToApp(msg_read_file_memory_content, {
        fileContent,
      });
    } else {
      agent.logger.error(`webpack client memory file[${data.filePath}] not exist!`);
      agent.messenger.sendToApp(msg_read_file_memory_content, {
        fileContent: '',
      });
    }
  });
};
