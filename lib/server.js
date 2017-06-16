'use strict';

const webpack = require('webpack');
const koa = require('koa');
const cors = require('kcors');
const Utils = require('./utils');
const app = koa();
app.use(cors());

const msg_build_state = 'webpack_build_state';
const msg_build_success = 'webpack_build_success';
const msg_read_file_memory = 'webpack_read_file_memory';
const msg_read_file_memory_content = 'webpack_read_file_memory_content';

class WebpackServer {
  constructor(agent, config) {
    this.agent = agent;
    this.config = config;
    this.buildCount = 0;
    this.compilerCount = this.config.webpackConfigList.length;
  }

  start() {
    const compilers = [];
    this.config.webpackConfigList.forEach((webpackConfig, index) => {
      const compiler = this.build(webpackConfig);
      this.server(compiler, {
        hot: webpackConfig.target !== 'node',
        port: this.config.port + index,
        publicPath: webpackConfig.output.publicPath,
      });
      compilers.push(compiler);
    });
    this.listen(compilers);
  }

  state() {
    return this.buildCount % this.compilerCount === 0;
  }


  build(webpackConfig) {
    const compiler = webpack([webpackConfig]);
    compiler.plugin('done', compilation => {
      this.buildCount++;
      compilation.stats.forEach(stat => {
        stat.compilation.children = stat.compilation.children.filter(child => {
          return child.name !== 'extract-text-webpack-plugin';
        });
      });
      this.agent.messenger.sendToApp(msg_build_state, { state: this.state() });
      this.agent[msg_build_success] = true;
    });
    return compiler;
  }

  listen(compilers) {

    this.agent.messenger.on(msg_build_state, () => {
      this.agent.messenger.sendToApp(msg_build_state, { state: this.state() });
    });

    this.agent.messenger.on(msg_read_file_memory, data => {
      const fileContent = Utils.readWebpackMemoryFile(compilers, data.filePath);
      this.agent.messenger.sendToApp(msg_read_file_memory_content, {
        fileContent,
      });
    });
  }

  server(compiler, config) {
    const port = config.port;
    const hot = config.hot;
    const publicPath = config.publicPath;
    const devMiddleware = require('koa-webpack-dev-middleware')(compiler, {
      publicPath,
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

    app.use(function *(next) {
      if (this.url === '/') {
        this.body = 'webpack build service';
      } else {
        yield next;
      }
    });

    app.listen(port, err => {
      if (!err) {
        this.agent.logger.info(`start webpack build server: http://127.0.0.1:${port}`);
      }
    });
  }
}

module.exports = WebpackServer;