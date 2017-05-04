'use strict';
exports.readWebpackMemoryFile = (compiler, filePath) => {
  const filerCompiler = compiler.compilers.filter(item => {
    return item.outputFileSystem.existsSync(filePath);
  });
  if (filerCompiler && filerCompiler.length) {
    return filerCompiler[0].outputFileSystem.readFileSync(filePath).toString('utf-8');
  }
  return '';
};
