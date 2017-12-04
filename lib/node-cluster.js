'use strict';

const cluster = require('cluster');
const EventEmitter = require('events').EventEmitter;
const cpuCount = require('os').cpus().length;

class NodeCluster {
  constructor() {
    this.running = true;
    this.emitter = new EventEmitter();
    this.runUntil = Date.now() + 1000;
    this.task = null;
    this.start();
  }

  start() {
    this.listen();
  }

  listen() {
    this.emitter.once('shutdown', this.shutdown);
    cluster.on('exit', this.restart);
    process.on('SIGINT', this.signal).on('SIGTERM', this.signal);
  }

  shutdown() {
    this.running = false;
    for (let id in cluster.workers) {
      cluster.workers[id].process.kill();
    }
    setTimeout(this.kill, 1000).unref();
  }

  signal() {
    this.emitter.emit('shutdown');
  }

  restart() {
    if (this.running && Date.now() < this.runUntil) {
      cluster.fork();
    }
  }

  kill() {
    for (let id in cluster.workers) {
      cluster.workers[id].kill();
    }
    process.exit();
  }
}

exports.run = task => {
  if (cluster.isWorker) {
    console.log('NodeCluster isWorker');
    task(cluster.worker.id)
  }else{
    console.log('NodeCluster isMaster');
    new NodeCluster();
    cluster.fork();
  }
};