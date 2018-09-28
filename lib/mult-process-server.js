'use strict';
const path = require('path');
const child_process = require('child_process');
const Constant = require('./constant');
const build = require('./build');

class WebpackServer {
  constructor(agent, config) {
    this.agent = agent;
    this.config = config;
    this.compilerCount = 2;
    this.compileDoneCount = 0;
    this.startTime = Date.now();
    this.debugPort = config.debugPort || 5900;
    this.port = config.port;
  }

  start() {
    // 是否存在 dll 配置且dll.json 不存在, 则优先构建 dll.json 文件
    build.dll(this.config, { baseDir: this.agent.baseDir }, () => {
      this.process('web', this.config.port);
    });
    this.process('node', this.config.port + 1);
    this.listen();
  }

  process(target, port) {
    const execArgv = this.agent.options && this.agent.options.isDebug ? process.execArgv.concat([ `--debug-port=${this.debugPort++}` ]) : process.execArgv;
    const n = child_process.fork(path.join(__dirname, 'child-process.js'), [], { execArgv });
    n.on('message', m => {
      if (m.action === 'done') {
        this.compileDoneCount++;
        this.state = this.compileDoneCount === this.compilerCount;
        this.port = m.port;
        this.sendToApp();
        this.openBrowser();
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
      port,
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

  listen() { // worker reload
    this.agent.messenger.on(Constant.EVENT_WEBPACK_BUILD_STATE, () => {
      this.sendToApp();
    });
  }

  sendToApp() {
    if (this.state) {
      this.agent.messenger.sendToApp(Constant.EVENT_WEBPACK_BUILD_STATE, { state: this.state, port: this.port });
    }
  }

  openBrowser() {
    if (this.state) {
      this.agent.messenger.sendToApp(Constant.EVENT_WEBPACK_OPEN_BROWSER);
    }
  }
}

module.exports = WebpackServer;
