'use strict';
const Constant = require('./constant');

class FileSystem {

  constructor(app) {
    this.app = app;
  }

  readServerFile(filePath, fileName) {
    return new Promise(resolve => {
      this.app.messenger.sendToAgent(Constant.EVENT_WEBPACK_READ_CLIENT_FILE_MEMORY, {
        filePath,
        fileName,
      });
      this.app.messenger.on(Constant.EVENT_WEBPACK_READ_CLIENT_FILE_MEMORY_CONTENT, data => {
        resolve(data.fileContent);
      });
    });
  }

  readClientFile(filePath, fileName) {
    return new Promise(resolve => {
      this.app.messenger.sendToAgent(Constant.EVENT_WEBPACK_READ_SERVER_FILE_MEMORY, {
        filePath,
        fileName,
      });
      this.app.messenger.on(Constant.EVENT_WEBPACK_READ_SERVER_FILE_MEMORY_CONTENT, data => {
        resolve(data.fileContent);
      });
    });
  }
}

module.exports = FileSystem;
