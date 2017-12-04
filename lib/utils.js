'use strict';
const path = require('path');
const fs = require('fs');
const assert = require('assert');
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

exports.requireModule = (module, baseDir) => {
  try {
    const modulepath = path.join(baseDir, 'node_modules', module);
    return require(modulepath);
  } catch (e) {
    return require(module);
  }
};

exports.getWebpackConfig = (config, option) => {
  let module = config.module;
  if (!module) {
    const configFile = path.join(option.baseDir, 'webpack.config.js');
    if (fs.existsSync(configFile)) {
      const webpackBuilderConfig = require(configFile);
      const framework = webpackBuilderConfig.framework;
      if (framework) {
        module = `easywebpack-${framework}`;
      }
    }
  }
  assert(module, 'please set [egg-webpack] plugin config.module');
  const EasyWebpack = exports.requireModule(module, option.baseDir);
  return EasyWebpack.getWebpackConfig(null, option);
};