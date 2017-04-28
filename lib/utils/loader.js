'use strict';

const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = config => {

  const loader = {};

  loader.assetsPath = (config, _path) => {
    return path.posix.join(config.build.staticDir, _path);
  };

  /**
   * {[ '/app/web/asset/style','/app/web/framework' ],c: '1',d: 'test',a: true,b: false }
   * => includePaths[]=/app/web/asset/style,includePaths[]=/app/web/framework,c=1,d=test,+a,-b
   * @param {Object}  options  json config
   * @param {String}  name  loader name or loader entry filepath
   * @return {String} format loader option str
   */
  loader.getOptionString = (options, name) => {
    const kvArray = [];
    options && Object.keys(options).forEach(key => {
      const value = options[key];
      if (Array.isArray(value)) {
        value.forEach(item => {
          kvArray.push(`${key}[]=${item}`);
        });
      } else if (typeof value === 'object') {
        // TODO:
      } else if (typeof value === 'boolean') {
        kvArray.push(value === true ? `+${key}` : `-${key}`);
      } else {
        kvArray.push(`${key}=${value}`);
      }
    });
    const optionStr = kvArray.join(',');
    if (name) {
      return /\?/.test(name) ? name + ',' + optionStr : name + (optionStr ? '?' + optionStr : '');
    }
    return optionStr;
  };

  loader.loadVueOption = options => {
    const loaderOptions = {
      postcss: [
        require('autoprefixer')({
          browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8'],
        }),
      ],
      loaders: loader.cssLoaders(options),
    };
    return merge(loaderOptions, options);
  };


  loader.cssLoaders = options => {
    options = options || {};

    const loadersOption = Object.assign({}, config.webpack && config.webpack.loaderOption, options);

    function generateLoaders(loaders) {
      const sourceLoader = loaders.map(item => {
        const loaderOption = loadersOption[item] || loadersOption[item.replace(/-loader/, '')];
        return loader.getOptionString(loaderOption, require.resolve(item));
      }).join('!');

      const styleName = 'vue-style-loader';
      const styleOption = loadersOption[styleName] || loadersOption[styleName.replace(/-loader/, '')];
      const styleLoader = loader.getOptionString(styleOption, require.resolve(styleName));
      if (options.extract) {
        return ExtractTextPlugin.extract({
          fallback: styleLoader,
          use: sourceLoader,
        });
      }
      return [styleLoader, sourceLoader].join('!');
    }

    return {
      css: generateLoaders(['css-loader', 'postcss-loader']),
      less: generateLoaders(['css-loader', 'postcss-loader', 'less-loader']),
      scss: generateLoaders(['css-loader', 'postcss-loader', 'sass-loader']),
      sass: generateLoaders(['css-loader', 'postcss-loader', 'sass-loader']),
    };
  };

  loader.styleLoaders = options => {
    const output = [];
    const loaders = this.cssLoaders(options);
    for (const extension in loaders) {
      const loader = loaders[extension];
      output.push({
        test: new RegExp('\\.' + extension + '$'),
        loader,
      });
    }
    return output;
  };

  loader.loadNodeModules = () => {
    const nodeModules = {};
    fs.readdirSync('node_modules').filter(x => {
      return ['.bin'].indexOf(x) === -1;
    }).forEach(mod => {
      nodeModules[mod] = 'commonjs2 ' + mod;
    });
    return nodeModules;
  };

  return loader;

};
