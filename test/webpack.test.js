'use strict';

const request = require('supertest');
const mm = require('egg-mock');

describe('test/webpack.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/webpack-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  it('should GET /', () => {
    return request(app.callback())
      .get('/')
      .expect('hi, egg-webpack')
      .expect(200);
  });
});
