'use strict';

module.exports = agent => {
  require('./lib/service/client')(agent);
  // require('./lib/service/server')(agent);
};

