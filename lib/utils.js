'use strict';
const path = require('path');
const fs = require('fs');
const IMG_REGEX = /\.(png|jpe?g|gif|svg)(\?.*)?$/;
const PKG_PREFIX = '@easy-team';

exports.getPkgInfo = baseDir => {
  const pkgFile = path.join(baseDir || process.cwd(), 'package.json');
  if (fs.existsSync(pkgFile)) {
    return require(pkgFile);
  }
  return {};
};

exports.readWebpackMemoryFile = (compiler, filePath) => {
  const compilerList = Array.isArray(compiler) ? compiler : [compiler];
  for (let i = 0; i < compilerList.length; i++) {
    const compilers = compilerList[i].compilers ? compilerList[i].compilers : [compilerList[i]];
    const fileCompiler = compilers.filter(item => {
      return item.outputFileSystem.existsSync(filePath);
    });
    if (fileCompiler && fileCompiler.length) {
      const ext = path.extname(filePath).toLocaleLowerCase();
      if (IMG_REGEX.test(ext)) {
        const base64 = fileCompiler[0].outputFileSystem.readFileSync(filePath).toString('base64');
        return `data:image/${ext.replace(/^\./, '')};base64,${base64}`;
      }
      return fileCompiler[0].outputFileSystem.readFileSync(filePath).toString('utf-8');
    }
  }
  return '';
};

exports.requireModule = (moduleName, baseDir) => {
  try {
    const modulepath = path.join(baseDir, 'node_modules', moduleName);
    return require(modulepath);
  } catch (e) {
    return require(moduleName);
  }
};


exports.requireEasyModule = (moduleName, baseDir) => {
  const name = `${PKG_PREFIX}/${moduleName}`;
  return exports.requireModule(name, baseDir);
};

exports.requireEasyCompatibleModule = (moduleName, baseDir) => {
  try {
    return exports.requireModule(moduleName, baseDir);
  } catch (e) {
    return exports.requireEasyModule(moduleName, baseDir);
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
    if (cliConfig.type === undefined && cliConfig.target === undefined) {
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
  const vuePkgName = 'easywebpack-vue';
  const reactPkgName = 'easywebpack-react';

  if (option.framework) {
    return option.framework;
  }
  const pkgFile = path.join(root, 'package.json');
  const pkg = require(pkgFile);
  const { dependencies = {}, devDependencies = {} } = pkg;
  if (dependencies['egg-view-vue-ssr'] || dependencies[vuePkgName] || devDependencies[vuePkgName]
  || dependencies[`${PKG_PREFIX}/${vuePkgName}`] || devDependencies[`${PKG_PREFIX}/${vuePkgName}`]) {
    return 'vue';
  } else if (dependencies['egg-view-react-ssr'] || dependencies[reactPkgName] || devDependencies[reactPkgName]
  || dependencies[`${PKG_PREFIX}/${reactPkgName}`] || devDependencies[`${PKG_PREFIX}/${reactPkgName}`]) {
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
  const easywebpack = exports.requireEasyCompatibleModule(module, baseDir);
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

// fix child process running mutil count
exports.getPort = port => {
  const pkgInfo = exports.getPkgInfo();
  const name = pkgInfo.name || 'webpack-project';
  const EASY_ENV_DEV_PORT = `EASY_ENV_DEV_PORT_${name}`;
  return Number(process.env[EASY_ENV_DEV_PORT] || port);
};
