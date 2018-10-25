'use strict';

const join = require('url').resolve;
const iconv = require('iconv-lite');
const coRequest = require('co-request');

module.exports = options => {
  options || (options = {});
  const request = coRequest.defaults({
    jar: options.jar === true
  });

  if (!(options.host || options.map || options.url)) {
    throw new Error('miss options');
  }

  return function* proxy(next) {
    const url = resolve(this.path, options);
    if (typeof options.suppressRequestHeaders === 'object') {
      options.suppressRequestHeaders.forEach((h, i) => {
        options.suppressRequestHeaders[i] = h.toLowerCase();
      });
    }

    const suppressResponseHeaders = []; // We should not be overwriting the options object!
    if (typeof options.suppressResponseHeaders === 'object') {
      options.suppressResponseHeaders.forEach(h => {
        suppressResponseHeaders.push(h.toLowerCase());
      });
    }

    // don't match
    if (!url) {
      return yield* next;
    }

    // if match option supplied, restrict proxy to that match
    if (options.match) {
      if (!this.path.match(options.match)) {
        return yield* next;
      }
    }

    const parsedBody = getParsedBody(this);

    let opt = {
      url: url + (this.querystring ? '?' + this.querystring : ''),
      headers: this.header,
      encoding: null,
      followRedirect: !(options.followRedirect === false),
      method: this.method,
      body: parsedBody,
      proxy: false, // some people may have HTTP_PROXY set, neglect
    };

    // set 'Host' header to options.host (without protocol prefix), strip trailing slash
    if (options.host) opt.headers.host = options.host.slice(options.host.indexOf('://') + 3).replace(/\/$/, '');

    if (options.requestOptions) {
      if (typeof options.requestOptions === 'function') {
        opt = options.requestOptions(this.request, opt);
      } else {
        Object.keys(options.requestOptions).forEach(option => {
          opt[option] = options.requestOptions[option];
        });
      }
    }

    for (const name in opt.headers) {
      if (options.suppressRequestHeaders && options.suppressRequestHeaders.indexOf(name.toLowerCase()) >= 0) {
        delete opt.headers[name];
      }
    }

    const res = yield request(opt);

    if (res.statusCode === 404) {
      yield next;
    } else {
      this.status = res.statusCode;

      for (const name in res.headers) {
        // http://stackoverflow.com/questions/35525715/http-get-parse-error-code-hpe-unexpected-content-length
        if (suppressResponseHeaders.indexOf(name.toLowerCase()) >= 0) {
          continue;
        }
        if (name === 'transfer-encoding') {
          continue;
        }
        this.set(name, res.headers[name]);
      }

      if (options.encoding === 'gbk') {
        this.body = iconv.decode(res.body, 'gbk');
        return;
      }

      // marking which middleware serves the request
      this.set('x-served-by', 'egg-webpack');
      this.body = res.body;

      if (options.yieldNext) {
        yield next;
      }
    }
  };
};

function resolve(path, options) {
  let url = options.url;
  if (url) {
    if (!/^http/.test(url)) {
      url = options.host ? join(options.host, url) : null;
    }
    return ignoreQuery(url);
  }

  if (typeof options.map === 'object') {
    if (options.map && options.map[path]) {
      path = ignoreQuery(options.map[path]);
    }
  } else if (typeof options.map === 'function') {
    path = options.map(path);
  }

  return options.host ? join(options.host, path) : null;
}

function ignoreQuery(url) {
  return url ? url.split('?')[0] : null;
}

function getParsedBody(ctx) {
  let body = ctx.request.body;
  if (body === undefined || body === null) {
    return undefined;
  }
  const contentType = ctx.request.header['content-type'];
  if (!Buffer.isBuffer(body) && typeof body !== 'string') {
    if (contentType && contentType.indexOf('json') !== -1) {
      body = JSON.stringify(body);
    } else {
      body = body + '';
    }
  }
  return body;
}
