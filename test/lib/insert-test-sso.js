'use strict';

var _ = require('lodash');
var async = require('async');

module.exports = function (options) {
  var seneca = this;
  var plugin = 'test-sso-data';
  seneca.add({role: plugin, cmd: 'insert', entity: 'apps'}, function (args, done) {
    var apps = require('../fixtures/apps');
    var index = 1;
    async.eachSeries(apps, function (app, sCb) {
      seneca.act({role: 'cd-users', cmd: 'list', query: {email: 'champion' + index + '@example.com'}},
      function (err, champions) {
        index++;
        var champ = champions[0];
        seneca.act({role: 'cd-sso', ctrl: 'app', cmd: 'create', app: app, user: champ}, function (err, app) {
          console.log('created', err, app);
          sCb();
        });
      });
    }, function (err) {
      done(err);
    });
  });

  return {
    name: plugin
  };
};
