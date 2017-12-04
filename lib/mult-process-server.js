'use strict';
const path = require('path');
const child_process = require('child_process');
const utils = require('./utils');
const build = require('./build');
const msg_build_state = 'webpack_build_state';
const msg_build_success = 'webpack_build_success';
const msg_read_file_memory = 'webpack_read_file_memory';
const msg_read_file_memory_content = 'webpack_read_file_memory_content';

class WebpackServer {
  constructor(agent, config) {
    this.agent = agent;
    this.config = config;
    this.appPort = config.appPort || process.env.PORT || 7001;
    this.compilerCount = 2;
    this.compileDoneCount = 0;
    this.startTime = Date.now();
  }

  start() {
    // 是否存在 dll 配置且dll.json 不存在, 则优先构建 dll.json 文件
    build.dll(this.config, { baseDir: this.agent.baseDir }, () => {
      this.process('web', 0);
      this.process('node', 1);
      this.listen();
    });
  }

  process(target, index) {
    const n = child_process.fork(path.join(__dirname, 'child-process.js'));
    n.on('message', m => {
      this.compileDoneCount++;
      if (m.action === 'done') {
        const state = this.checkBuildState(n);
        if (state) {
          this.agent.messenger.sendToApp(msg_build_state, { state });
        }
        this.agent[msg_build_success] = true;
      } else if (m.action === 'file') {
        // 获取到内存文件, 然后发送给 Egg Worker
        this.agent.messenger.sendToApp(msg_read_file_memory_content, {
          fileContent: m.fileContent, filePath: m.filePath
        });
      }
    });
    // 发送消息给子进程, 触发 Webpack 编译
    n.send({
      action: 'building',
      config: this.config,
      option: { target, index, baseDir: this.agent.baseDir, dll: false }
    });
    // 浏览器访问, 监听Egg Worker 发送过来读取内存文件(服务端渲染文件, 前端资源文件)
    this.agent.messenger.on(msg_read_file_memory, data => {
      n.send({ action: 'file', filePath: data.filePath });
    });
  }

  checkBuildState(n) {
    if (!this.buildState) {
      this.buildState = this.compileDoneCount > 0 && this.compileDoneCount % this.compilerCount === 0;
      if (this.buildState) {
        this.endTime = Date.now();
        setTimeout(()=> {
          console.log(`webpack build cost: ${this.endTime - this.startTime}ms`);
        }, 200);
        n.send({ action: 'done', appPort: this.appPort });
      }
    }
    return this.buildState;
  }

  listen() {
    this.agent.messenger.on(msg_build_state, () => {
      const state = this.checkBuildState();
      if (state) {
        this.agent.messenger.sendToApp(msg_build_state, { state });
      }
    });
  }
}

module.exports = WebpackServer;
