'use strict';

const Engine = require('../../lib/engine');
const WEBPACK = Symbol('Application#webpack');

module.exports = {
  get webpack() {
    if (!this[WEBPACK]) {
      this[WEBPACK] = Engine(this);
    }
    return this[WEBPACK];
  },
};
