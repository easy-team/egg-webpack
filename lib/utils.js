'use strict';
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const imgRegex = /\.(png|jpe?g|gif|svg)(\?.*)?$/;
exports.readWebpackMemoryFile = (compilerList, filePath) => {
  for (let i = 0; i < compilerList.length; i++) {
    const fileCompiler = compilerList[i].compilers.filter(item => {
      return item.outputFileSystem.existsSync(filePath);
    });
    if (fileCompiler && fileCompiler.length) {
      const ext = path.extname(filePath).toLocaleLowerCase();
      if (imgRegex.test(ext)) {
        const base64 = fileCompiler[0].outputFileSystem.readFileSync(filePath).toString('base64');
        return `data:image/${ext.replace(/^\./, '')};base64,${base64}`;
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

exports.getWebpackConfigJSON = (baseDir, pluginConfig) => {
  const filename = pluginConfig.webpackConfigFile || 'webpack.config.js';
  const webpackConfigFile = path.isAbsolute(filename) ? filename : path.join(baseDir, filename);
  if (fs.existsSync(webpackConfigFile)) {
    return require(webpackConfigFile);
  }
  const pkgFile = path.join(baseDir, 'package.json');
  if (fs.existsSync(pkgFile)) {
    const pkg = require(pkgFile);
    return pkg.webpack || {};
  }
  return {};
};

exports.isUseMultProcess = (baseDir, pluginConfig) => {
  if (pluginConfig && pluginConfig.webpackConfigList.length) {
    return false;
  }
  const cliConfig = exports.getWebpackConfigJSON(baseDir, pluginConfig);
  if (cliConfig) {
    if (cliConfig.type === undefined || cliConfig.target === undefined) {
      return true;
    }
    if (Array.isArray(cliConfig.type) && cliConfig.type.length > 1) {
      return true;
    }

    if (Array.isArray(cliConfig.target) && cliConfig.target.length > 1) {
      return true;
    }
  }
  return false;
};

exports.getFramework = (root, option = {}) => {
  if (option.framework) {
    return option.framework;
  }
  const pkgFile = path.join(root, 'package.json');
  const pkg = require(pkgFile);
  if (pkg.dependencies['egg-view-vue-ssr'] || pkg.dependencies['easywebpack-vue'] || pkg.devDependencies['easywebpack-vue']) {
    return 'vue';
  } else if (pkg.dependencies['egg-view-react-ssr'] || pkg.dependencies['easywebpack-react'] || pkg.devDependencies['easywebpack-react']) {
    return 'react';
  }
  return null;
};

exports.getWebpackConfig = (eggWebpackConfig, option) => {
  const baseDir = option.baseDir;
  const framework = exports.getFramework(baseDir, option);
  option.framework = framework;
  const module = framework ? `easywebpack-${framework}` : 'easywebpack';
  const webpackConfigFile = eggWebpackConfig.webpackConfigFile;
  const easywebpack = exports.requireModule(module, baseDir);
  return easywebpack.getWebpackConfig(webpackConfigFile, option);
};

exports.normalizeUrlFile = (baseDir, url, publicPath, buildPath) => {
  const normalizeBuildPath = buildPath.replace(baseDir, '').replace(/^\//, '').replace(/\/$/, '');
  const normalizeUrl = url.replace(publicPath, `/${normalizeBuildPath}/`);
  return path.join(baseDir, normalizeUrl);
};

exports.normalizeProxyUrlFile = (app, url) => {
  const webpack = app.config.webpack || {};
  if (webpack.publicPath && webpack.buildPath) {
    return exports.normalizeUrlFile(app.baseDir, url, webpack.publicPath, webpack.buildPath);
  }
  const manifestFile = path.join(app.baseDir, webpack.manifest || 'config/manifest.json');
  if (fs.existsSync(manifestFile)) {
    const manifest = require(manifestFile);
    const info = manifest.info;
    if (info && info.publicPath && info.buildPath) {
      return exports.normalizeUrlFile(app.baseDir, url, info.publicPath, info.buildPath);
    }
  }
  return path.join(app.baseDir, url);
};
