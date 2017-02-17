var _ = require('lodash');
var path = require('path');
module.exports = function (configOverride) {
  var config = require('./config/config.js')();
  var seneca = require('seneca')(_.extend(config, configOverride));
  seneca.use('entity');
  seneca.use('basic');
  seneca.use('seneca-joi');
  seneca.use('./cd-sso', {});
  // seneca.use('seneca-entity-tracker', { entities: ['app'] });
  seneca.use(require('cp-permissions-plugin'), {
    config: path.resolve(__dirname + '/lib/sso/controllers/perm') });
  return seneca;
};
