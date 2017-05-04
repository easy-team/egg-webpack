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

webpack dev server plugin for egg, support read file in memory and hot reload.


## Install

```bash
$ npm i egg-webpack --save
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

```js
// {app_root}/config/config.default.js
exports.webpack = {
  // port: 8090,
  // clientConfig: require(path.join(app.baseDir, 'build/easy/client.js')),
  // serverConfig: require(path.join(app.baseDir, 'build/easy/server.js')),
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Customise

- mount `app.webpack.fileSystem` to app, you can customize the file read logic

```js
// read webpack browser build mode memory file content
app.webpack.fileSystem.readClientFile(filePath).then(fileContent =>{

})

// read webpack node build mode memory file content
app.webpack.fileSystem.readServerFile(filePath).then(fileContent =>{

})
```

see [lib/service/filesystem.js](egg-webpack/lib/service/filesystem.js), [lib/service/client.js](egg-webpack/lib/service/client.js), [lib/service/server.js](egg-webpack/lib/service/server.js)  for more detail.


- monitor webpack build state

```js
app.messenger.on(app.webpack.Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, data => {
  if (data.state) {
    const filepath = app.config.webpackvue.build.manifest;
    const promise = app.webpack.fileSystem.readClientFile(filepath);
    promise.then(content => {
      fs.writeFileSync(filepath, content, 'utf8');
    });
  }
});
```

see [lib/service/constant.js](egg-webpack/lib/service/constant.js) for more detail.

## Questions & Suggestions

Please open an issue [here](https://github.com/hubcarl/egg-webpack/issues).

## License

[MIT](LICENSE)
