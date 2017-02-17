'use strict';

var _ = require('lodash');
var async = require('async');
var config = require('../../config/config.js')({port: 11307});
var seneca = require('seneca')(config);
seneca.use('entity');
var service = 'cp-sso-test';
var dgram = require('dgram');
seneca.use(require('./insert-test-sso'));


seneca.ready(function() {
  var message = new Buffer(service);
  var client = dgram.createSocket('udp4');
  client.send(message, 0, message.length, 11404, 'localhost', function (err, bytes) {
    client.close();
  });

  seneca.add({role: service, cmd: 'suicide'}, function (err, cb) {
    seneca.close(function (err) {
      process.exit(err ? 1: 0);
    });
    cb();
  });
});

require('../../network.js')(seneca);
// Add "its" µs as a dependency
seneca.client({ type: 'web', port: 10307, pin: { role: 'cd-sso', cmd: '*' } });
