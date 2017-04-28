'use strict';

const FileSystem = require('./filesystem');
const lib = require('../');
module.exports = app => {
  return Object.assign({}, lib, { fileSystem: new FileSystem(app) });
};
