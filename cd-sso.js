var _ = require('lodash');
var Promise = require('bluebird');
module.exports = function () {
  // https://github.com/senecajs/seneca/issues/112
  var seneca = this.root;
  var app = require('./lib/sso/entities/app.js').bind(seneca)();
  var approval = require('./lib/sso/entities/approval.js').bind(seneca)();
  var extendedApproval = require('./lib/sso/entities/extended-approval.js').bind(seneca)();
  var acts = {};
  var plugin = 'cd-sso';
  var senecaActP = Promise.promisify(seneca.act, {context: seneca});

  var keyCb = function (entityName, key) {
    return function (args) {
      return senecaActP(_.extend({
        role: plugin,
        entity: entityName,
        cmd: key
      }, args));
    };
  };

  // Load primitives
  [app, approval, extendedApproval].forEach(function (entity) {
    acts[entity.name] = {};
    for (var key in entity.acts) {
      var act = _.extend({
        role: plugin,
        entity: entity.name,
        cmd: key
      }, entity.acts[key].validation);
      seneca.add(act, entity.acts[key].cb);
      console.log('added act ',  act);
      // Add a promise shortcut for controllers
      acts[entity.name][key] = keyCb(entity.name, key);
      seneca.log.debug('added act role:' + entity.name + ' cmd:' + key);
    }
  });

  // Load controllers
  var ctrls = {};
  ctrls['app'] = require('./lib/sso/controllers/app/index').bind(seneca)();
  ctrls['app-approval'] = require('./lib/sso/controllers/app-approval/index').bind(seneca)();
  _.each(ctrls, function (ctrl, entity) {
    for (var key in ctrl.acts) {
      var act = _.extend({
        role: plugin,
        ctrl: entity,
        cmd: key
      }, ctrl.acts[key].validation);
      seneca.add(act, ctrl.acts[key].cb);
      seneca.log.info('added act', act, {joi$: ctrl.acts[key].validation});
      // No promise are added, we shouldn't have to reuse the same function twice. If we do, create an utility
    }
  });

  // Load utilities
  // -> none atm

  return {
    name: plugin,
    exportmap: {
      acts: acts
    }
  };
};
