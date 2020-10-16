# egg-webpack

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-webpack.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-webpack
[travis-image]: https://img.shields.io/travis/hubcarl/egg-webpack.svg?style=flat-square
[travis-url]: https://travis-ci.org/hubcarl/egg-webpack
[codecov-image]: https://img.shields.io/codecov/c/github/hubcarl/egg-webpack.svg?style=flat-square
[codecov-url]: https://codecov.io/github/hubcarl/egg-webpack?branch=master
[david-image]: https://img.shields.io/david/hubcarl/egg-webpack.svg?style=flat-square
[david-url]: https://david-dm.org/hubcarl/egg-webpack
[snyk-image]: https://snyk.io/test/npm/egg-webpack/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-webpack
[download-image]: https://img.shields.io/npm/dm/egg-webpack.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-webpack

Webpack dev server plugin for egg, support read file in memory and hot reload. [More Detail](http://hubcarl.github.io/blog/2017/04/15/egg-webpack/)

## Version

- egg-webpack ^5.x.x > webpack 5.x.x
- egg-webpack ^4.x.x > webpack 4.x.x
- egg-webpack ^3.x.x > webpack 3.x.x

## Install

```bash
npm i egg-webpack --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.webpack = {
  enable: true,
  package: 'egg-webpack',
};
```

## Configuration

**support native webpack config and easywebpack webpack config**

```js
// {app_root}/config/config.default.js
exports.webpack = {
  // port: 9000,  

  // webpackConfigList: [],
};
```

- **port**: {Number}, default 9000。webpack dev server port, default 9000,  when hava multile webpack config, the port incremented。
- **offsetPort**: {Boolean}, default false。when mutil webpack target web config, need set true。
- **browser**: {Boolean | String}  if it is boolean type, whether to open the browser automatically, defualt true; if it is string。
That is url address, will automatically open the browser's url address。
- **proxy**: {Boolean | Object}. webpack compiled in a separate service inside, default webpack service is http://127.0.0.1:9000, you can set koa-proxy options access static resources by [koa-proxy](https://github.com/popomore/koa-proxy)。the default options:

```js
config.webpack = {
  proxy: {
    host: 'http://127.0.0.1:9000', // target host that matched path will be proxy to
    match: /^\/public\//, // proxy url path pattern.
  },
}
```

- **webpackConfigList**: {Array}, optional, default []. native webpack config.
- **webpackConfigFile**: {String}, optional, you must set when you easywebpack config file is not in the project root directory。


### webpack native configuration

- if you write one native webpack config `${app_root}/build/webpack.config.js`, you can use like this:

```js
// {app_root}/config/config.default.js
exports.webpack = {
  webpackConfigList: [require('../build/webpack.config.js')]
};
```

- if you use easywebpack solution, you can use like this:

default read `webpack.config.js` file under the project root directory.

```js
const EasyWebpack = require('easywebpack-vue');
// {app_root}/config/config.default.js
exports.webpack = {
  webpackConfigList: EasyWebpack.getWebpackConfig()
};
```

- if you use easywebpack solution, the easywebpack config file in `${app_root}/build/webpack.config.js`,  you can use like this:

```js
const EasyWebpack = require('easywebpack-vue');
// {app_root}/config/config.default.js
exports.webpack = {
  webpackConfigList: EasyWebpack.getWebpackConfig('build/webpack.config.js')
};
```

### easywebpack configuration

The default read `webpack.config.js` file under the project root directory.

```js
// {app_root}/config/config.default.js
exports.webpack = {
  webpackConfigFile: 'build/webpack.config.js', // easywebpack config file path
};
```


see [config/config.default.js](config/config.default.js) for more detail.

## Customize

- mount `app.webpack.fileSystem` to app, you can customize the webpack memory file read logic

```js
// read webpack browser build mode memory file content
app.webpack.fileSystem.readWebpackMemoryFile(filePath).then(fileContent =>{

})
```

- render vue from webpack memory

```js
'usestrict';
const path = require('path');
const egg = require('egg');
const vueServerRenderer = require('vue-server-renderer');
module.exports = class IndexController extends egg.Controller {
  async index(ctx) {
    const { app } = ctx;
    const filepath = path.join(app.config.view.root[0], 'app.js');
    // server render mode, the webpack config target:node
    const strJSBundle = await app.webpack.fileSystem.readWebpackMemoryFile(filepath);
    ctx.body = await vueServerRenderer.createBundleRenderer(strJSBundle).renderToString({});
  }
};
```

see [lib/server.js](lib/server.js)  for more detail.


- monitor webpack build state

```js
app.messenger.on(app.webpack.Constant.EVENT_WEBPACK_BUILD_STATE, data => {
  if (data.state) {
    const filepath = path.join(app.baseDir, 'config/manifest.json');
    const promise = app.webpack.fileSystem.readWebpackMemoryFile(filepath);
    promise.then(content => {
      fs.writeFileSync(filepath, content, 'utf8');
    });
  }
});
```

see [lib/constant.js](lib/constant.js) for more detail.

## Questions & Suggestions

Please open an issue [here](https://github.com/hubcarl/egg-webpack/issues).

## License

[MIT](LICENSE)
