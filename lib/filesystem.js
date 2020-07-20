'use strict';
const Constant = require('./constant');

class FileSystem {

  constructor(app) {
    this.app = app;
  }

  readWebpackMemoryFile(filePath, fileName, target = 'node') {
    return new Promise(resolve => {
      this.app.messenger.sendToAgent(Constant.EVENT_WEBPACK_READ_FILE_MEMORY, {
        filePath,
        fileName,
        target
      });
      this.app.messenger.once(Constant.EVENT_WEBPACK_READ_FILE_MEMORY_CONTENT, data => {
        if (filePath === data.filePath) {
          resolve(data.fileContent);
        }
      });
    });
  }
}

module.exports = FileSystem;
