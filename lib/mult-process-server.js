'use strict';
const path = require('path');
const child_process = require('child_process');
const WebpackTool = require('webpack-tool');
const Constant = require('./constant');
const build = require('./build');

class WebpackServer {
  constructor(agent, config) {
    this.agent = agent;
    this.config = config;
    this.browser = config.browser;
    this.compilerCount = 2;
    this.compileDoneCount = 0;
    this.startTime = Date.now();
    this.debugPort = config.debugPort || 5900;
    const cluster = this.agent.config.cluster;
    if (agent.options.port) {
      this.appPort = agent.options.port;
    } else if (cluster && cluster.listen && cluster.listen.port) {
      this.appPort = cluster.listen.port;
    } else {
      this.appPort = this.config.appPort || process.env.PORT || 7001;
    }
  }

  start() {
    // 是否存在 dll 配置且dll.json 不存在, 则优先构建 dll.json 文件
    build.dll(this.config, { baseDir: this.agent.baseDir }, () => {
      this.process('web', 0);
    });
    this.process('node', 1);
    this.listen();
  }

  process(target, index) {
    const execArgv = this.agent.options && this.agent.options.isDebug ? process.execArgv.concat([ `--debug-port=${this.debugPort++}` ]) : process.execArgv;
    const n = child_process.fork(path.join(__dirname, 'child-process.js'), [], { execArgv });
    n.on('message', m => {
      if (m.action === 'done') {
        this.compileDoneCount++;
        const state = this.compileDoneCount === this.compilerCount;
        this.agent.messenger.sendToApp(Constant.EVENT_WEBPACK_BUILD_STATE, { state });
        if (state) {
          if (/^https?/.test(this.browser)) {
            WebpackTool.utils.openBrowser(this.appPort, this.browser);
          } else if (this.browser === undefined || this.browser === true) {
            WebpackTool.utils.openBrowser(this.appPort);
          }
        }
      } else if (m.action === 'file') {
        // 获取到内存文件, 然后发送给 Egg Worker
        this.agent.messenger.sendToApp(Constant.EVENT_WEBPACK_READ_FILE_MEMORY_CONTENT, {
          fileContent: m.fileContent, filePath: m.filePath
        });
      }
    });
    // 发送消息给子进程, 触发 Webpack 编译
    n.send({
      target,
      index,
      action: 'building',
      baseDir: this.agent.baseDir,
      config: this.config
    });
    // 浏览器访问, 监听Egg Worker 发送过来读取内存文件(服务端渲染文件, 前端资源文件)
    this.agent.messenger.on(Constant.EVENT_WEBPACK_READ_FILE_MEMORY, data => {
      if (data.target === target) {
        n.send({ action: 'file', filePath: data.filePath });
      }
    });
  }

  listen() {
    this.agent.messenger.on(Constant.EVENT_WEBPACK_BUILD_STATE, () => {
      const state = this.compileDoneCount === this.compilerCount;
      this.agent.messenger.sendToApp(Constant.EVENT_WEBPACK_BUILD_STATE, { state });
    });
  }
}

module.exports = WebpackServer;
