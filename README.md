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

server and client project build solution for egg + webpack

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

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/hubcarl/egg-webpack/issues).

## License

[MIT](LICENSE)
