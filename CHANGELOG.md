<a name="4.5.5"></a>
## [4.5.5](https://github.com/easy-team/egg-webpack/compare/4.5.4...4.5.5) (2021-02-05)


### Bug Fixes

* 静态资源进入 middleware, proxy middleware 插入需要在静态资源和自定义中间件前面 ([3b8af83](https://github.com/easy-team/egg-webpack/commit/3b8af83))



<a name="4.5.4"></a>
## [4.5.4](https://github.com/easy-team/egg-webpack/compare/4.5.3...4.5.4) (2020-07-20)


### Bug Fixes

* https://github.com/easy-team/egg-webpack/issues/23 ([40a7c2b](https://github.com/easy-team/egg-webpack/commit/40a7c2b))



<a name="4.5.3"></a>
## [4.5.3](https://github.com/easy-team/egg-webpack/compare/4.5.2...4.5.3) (2020-04-11)


### Bug Fixes

* child process running port had used ([f4ffc2c](https://github.com/easy-team/egg-webpack/commit/f4ffc2c))



<a name="4.5.1"></a>
## [4.5.1](https://github.com/easy-team/egg-webpack/compare/4.5.0...4.5.1) (2019-08-08)


### Bug Fixes

* port proxy not effective ([fa46f99](https://github.com/easy-team/egg-webpack/commit/fa46f99))



<a name="4.5.0"></a>
# [4.5.0](https://github.com/easy-team/egg-webpack/compare/4.4.9...4.5.0) (2019-08-03)


### Features

* compatible [@easy-team](https://github.com/easy-team) mode ([c34806b](https://github.com/easy-team/egg-webpack/commit/c34806b))



<a name="4.4.9"></a>
## [4.4.9](https://github.com/easy-team/egg-webpack/compare/4.4.8...4.4.9) (2018-11-01)


### Bug Fixes

* child process not exit ([20a02d1](https://github.com/easy-team/egg-webpack/commit/20a02d1))



<a name="4.4.8"></a>
## [4.4.8](https://github.com/easy-team/egg-webpack/compare/4.4.7...4.4.8) (2018-10-26)


### Bug Fixes

* proxy request doesn’t respect HTTP_PROXY ([5a589c9](https://github.com/easy-team/egg-webpack/commit/5a589c9))


### Features

* add a header ([c926325](https://github.com/easy-team/egg-webpack/commit/c926325))



<a name="4.4.6"></a>
## [4.4.6](https://github.com/easy-team/egg-webpack/compare/4.4.5...4.4.6) (2018-10-16)


### Bug Fixes

* webpack proxy repeat register ([a12fa74](https://github.com/easy-team/egg-webpack/commit/a12fa74))



<a name="4.4.5"></a>
## [4.4.5](https://github.com/easy-team/egg-webpack/compare/4.4.4...4.4.5) (2018-10-15)


### Bug Fixes

* config.target:web webpack config error ([77d5592](https://github.com/easy-team/egg-webpack/commit/77d5592))



<a name="4.4.4"></a>
## [4.4.4](https://github.com/easy-team/egg-webpack/compare/4.4.3...4.4.4) (2018-10-12)


### Bug Fixes

* webpack loading when file update ([ce79a4c](https://github.com/easy-team/egg-webpack/commit/ce79a4c))



<a name="4.4.2"></a>
## [4.4.2](https://github.com/easy-team/egg-webpack/compare/4.4.1...4.4.2) (2018-10-11)


### Bug Fixes

* worker reload get new port will lead static file error ([b532423](https://github.com/easy-team/egg-webpack/commit/b532423))



<a name="4.4.1"></a>
## [4.4.1](https://github.com/hubcarl/egg-webpack/compare/4.4.0...4.4.1) (2018-10-11)


### Bug Fixes

* koa proxy register order ([510904b](https://github.com/hubcarl/egg-webpack/commit/510904b))



<a name="4.3.1"></a>
## [4.3.1](https://github.com/hubcarl/egg-webpack/compare/4.3.0...4.3.1) (2018-09-17)


### Bug Fixes

* webpack  proxy url port when webpack server port update ([b5dd55a](https://github.com/hubcarl/egg-webpack/commit/b5dd55a))



<a name="4.3.0"></a>
# [4.3.0](https://github.com/hubcarl/egg-webpack/compare/4.1.2...4.3.0) (2018-09-16)


### Features

* auto get app port ([b099531](https://github.com/hubcarl/egg-webpack/commit/b099531))
* upgrade webpack latest version for mini-css-extract-plugin ([fe5c205](https://github.com/hubcarl/egg-webpack/commit/fe5c205))
* zero config ([3dd7b4a](https://github.com/hubcarl/egg-webpack/commit/3dd7b4a))



<a name="4.1.2"></a>
## [4.1.2](https://github.com/hubcarl/egg-webpack/compare/4.1.0...4.1.2) (2018-05-30)


### Bug Fixes

* master process exit, child process exit ([0f4f433](https://github.com/hubcarl/egg-webpack/commit/0f4f433))
* memory file not exist, use disk file ([bdd6e63](https://github.com/hubcarl/egg-webpack/commit/bdd6e63))



<a name="4.1.1"></a>
## [4.1.1](https://github.com/hubcarl/egg-webpack/compare/3.2.4...4.1.1) (2018-04-09)


### Bug Fixes

* compatible old version for dll and add use doc ([ff2056e](https://github.com/hubcarl/egg-webpack/commit/ff2056e))
* default url ([4484652](https://github.com/hubcarl/egg-webpack/commit/4484652))
* egg static resource no proxy ([460b57c](https://github.com/hubcarl/egg-webpack/commit/460b57c))
* egg-webpack proxy and webpack-tool proxy repeat ([dcea541](https://github.com/hubcarl/egg-webpack/commit/dcea541))
* master process exit, child process exit ([0f4f433](https://github.com/hubcarl/egg-webpack/commit/0f4f433))
* normalizeUrlFile might get undefined ([b189183](https://github.com/hubcarl/egg-webpack/commit/b189183))
* not use default port error ([5544f1e](https://github.com/hubcarl/egg-webpack/commit/5544f1e))
* static proxy ([69557b8](https://github.com/hubcarl/egg-webpack/commit/69557b8))
* url has params , not match ([c084e72](https://github.com/hubcarl/egg-webpack/commit/c084e72))
* webpack target info show ([aacf45d](https://github.com/hubcarl/egg-webpack/commit/aacf45d))


### Features

* add webpack target info ([eb6ea23](https://github.com/hubcarl/egg-webpack/commit/eb6ea23))
* add webpackconfig parmas for stats ([bf9640c](https://github.com/hubcarl/egg-webpack/commit/bf9640c))
* support config.browser config, auto open browser or diable  or custom url address ([dc4b322](https://github.com/hubcarl/egg-webpack/commit/dc4b322))
* support dll file use memory read ([c50bf27](https://github.com/hubcarl/egg-webpack/commit/c50bf27))
* use koa-proxy proxy static resource ([86a7277](https://github.com/hubcarl/egg-webpack/commit/86a7277))



<a name="4.1.0"></a>
# [4.1.0](https://github.com/hubcarl/egg-webpack/compare/4.0.5...4.1.0) (2018-03-29)


### Features

* support dll file use memory read ([c50bf27](https://github.com/hubcarl/egg-webpack/commit/c50bf27))



<a name="4.0.5"></a>
## [4.0.5](https://github.com/hubcarl/egg-webpack/compare/4.0.4...4.0.5) (2018-03-20)


### Bug Fixes

* normalizeUrlFile might get undefined ([b189183](https://github.com/hubcarl/egg-webpack/commit/b189183))
* not use default port error ([5544f1e](https://github.com/hubcarl/egg-webpack/commit/5544f1e))



<a name="4.0.4"></a>
## [4.0.4](https://github.com/hubcarl/egg-webpack/compare/4.0.3...4.0.4) (2018-03-20)


### Bug Fixes

* static proxy ([69557b8](https://github.com/hubcarl/egg-webpack/commit/69557b8))



<a name="4.0.2"></a>
## [4.0.2](https://github.com/hubcarl/egg-webpack/compare/3.3.2...4.0.2) (2018-03-07)


### Bug Fixes

* egg-webpack proxy and webpack-tool proxy repeat ([dcea541](https://github.com/hubcarl/egg-webpack/commit/dcea541))


### Features

* add webpack target info ([eb6ea23](https://github.com/hubcarl/egg-webpack/commit/eb6ea23))
* add webpackconfig parmas for stats ([bf9640c](https://github.com/hubcarl/egg-webpack/commit/bf9640c))
* use koa-proxy proxy static resource ([86a7277](https://github.com/hubcarl/egg-webpack/commit/86a7277))
* webpack target info show ([aacf45d](https://github.com/hubcarl/egg-webpack/commit/aacf45d))



<a name="3.3.0"></a>
# [3.3.0](https://github.com/hubcarl/egg-webpack/compare/3.2.8...3.3.0) (2018-01-22)


### Features

* support config.browser config, auto open browser or diable or custom url address ([dc4b322](https://github.com/hubcarl/egg-webpack/commit/dc4b322))


### BugFixs

* https://github.com/hubcarl/egg-vue-webpack-boilerplate/issues/54 ([dc4b322](https://github.com/hubcarl/egg-webpack/commit/dc4b322))



3.2.8 / 2017-12-26
==================

  * fix: compatible old version for dll and add use doc

3.2.7 / 2017-12-26
==================

  * fix:node client render single webpackConfig

3.2.5 / 2017-12-22
==================

  * fix: modify publicPath, the proxy path is error

3.2.4 / 2017-12-16
==================

  * fix: vscode auto import unuse package
  * fix: support before low version
  * fix: message tip

3.2.2 / 2017-12-13
==================

  * fix: no dll, webpack build twice

3.2.1 / 2017-12-09
==================

  * refactor: adjust get webpack config logic
  * refacotr: get webpack config login

3.2.0 / 2017-12-08
==================

  * feat: support webpack mult process build

3.0.2 / 2017-11-22
==================

  * fix: devtool source map file can`t find

3.0.1 / 2017-11-16
==================

  * fix: support not exists url
  * feat: webpack 3

2.2.4 / 2017-07-31
==================

  * fix:agent can not  call sendToApp before server started
  * fix:hot port mapping easywepback

2.2.2 / 2017-07-18
==================

  * feat: html read from memory

2.2.1 / 2017-07-17
==================

  * fix: node server code update, webpack loading state

2.2.0 / 2017-07-14
==================

  * feat:http static resource mapping relative path
  * feat:update default port 9000
  * refactor:use webpack-tool start server
  * docs:update use doc

2.0.0 / 2017-06-19
==================

  * refactor:seperate easywebpack

0.2.0 / 2017-06-12
==================

  * feat:support custom server

0.1.1 / 2017-05-19
==================

  * feat:default webpack build config path


0.1.0 / 2017-05-12
==================

  * feat: only client build, only server build , client and server build
  * style:update github language show
