"use strict";

const os = require('os');
const cluster = require('cluster');


cluster.setupMaster({
  exec: 'index.js'
});

cluster.on('exit', function(worker) {
  console.log('worker ' + worker.id + ' died');
  cluster.fork();
});

for (let i = 0; i < os.cpus().length; i++) {
  cluster.fork();
}
