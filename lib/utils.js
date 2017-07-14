'use strict';
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const imgRegex = /\.(png|jpe?g|gif|svg)(\?.*)?$/;
exports.readWebpackMemoryFile = (compilerList, filePath) => {
  for (let i = 0; i < compilerList.length; i++) {
    const fileCompiler = compilerList[i].compilers.filter(item => {
      return item.outputFileSystem.existsSync(filePath);
    });
    if (fileCompiler && fileCompiler.length) {
      const ext = path.extname(filePath).toLocaleLowerCase();
      if (ext === false && imgRegex.test(ext)) {
        const base64 = fileCompiler[0].outputFileSystem.readFileSync(filePath).toString('base64');
        const base64Image = `data:image/${ext.replace(/^\./, '')};base64,${base64}`;
        if (!fs.existsSync(filePath)) {
          mkdirp.sync(path.dirname(filePath));
          fs.writeFileSync(filePath, base64, 'base64');
        }
        return base64Image;
      }
      return fileCompiler[0].outputFileSystem.readFileSync(filePath).toString('utf-8');
    }
  }
  return '';
};
