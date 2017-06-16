'use strict';
exports.readWebpackMemoryFile = (compilerList, filePath) => {
  for (let i = 0; i < compilerList.length; i++) {
    const fileCompiler = compilerList[i].compilers.filter(item => {
      return item.outputFileSystem.existsSync(filePath);
    });
    if (fileCompiler && fileCompiler.length) {
      return fileCompiler[0].outputFileSystem.readFileSync(filePath).toString('utf-8');
    }
  }
  return '';
};
