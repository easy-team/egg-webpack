const NodeCluster = require('../lib/node-cluster');

NodeCluster.run(function(id){
  console.log('id', id);
});