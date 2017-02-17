var seneca = require('../../imports')({log: {level: 'info'}});
require('../../network')(seneca);
var _ = require('lodash');
var flat = require('flat');
// ENTITIES
var entities = {};
entities['app'] = require('../../lib/sso/entities/app.js').bind(seneca)();
entities['approval'] = require('../../lib/sso/entities/approval.js').bind(seneca)();
// CTRLS
var ctrls = {};
ctrls['app'] = require('../../lib/sso/controllers/app/index.js').bind(seneca)();
ctrls['approval'] = require('../../lib/sso/controllers/app-approval/index.js').bind(seneca)();
// Test data
var fixes = {};
// we're getting high here !!
fixes.app = require('../fixtures/apps.js')[0];
// WOHOOOOO
fixes['app-approval'] = require('../fixtures/approval.js');

var async = require('async');
var _lab = require('lab');
var lab = exports.lab = _lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = require('code').expect;

describe('cp-sso-controller', function () {
  var testedEnt = {};
  lab.before(function (done) {
    seneca.ready(function () {
      done();
    });
  });

  it('should register entity acts', function (done) {
    var acts = seneca.list();
    var expected_acts = [];
    _.each(entities, function (entity) {
      _.each(entity.acts, function (def, act) {
        expected_acts.push({role: 'cd-sso', entity: entity.name, cmd: act});
      });
    });
    seneca.log.info('1/', acts.length - _.pullAllWith(_.clone(acts), expected_acts, _.isEqual).length, expected_acts.length);
    expect(acts.length - _.pullAllWith(_.clone(acts), expected_acts, _.isEqual).length).to.be.equal(expected_acts.length);
    expect(expected_acts.length).to.be.above(1);
    done();
  });

  it('should register controllers acts', function (done) {
    // TODO : extend to other controllers
    async.eachSeries(ctrls, function (ctl, cbS) {
      async.eachOfSeries(ctl.acts, function (fixt, key, cbOS) {
        var cmd = {role: 'cd-sso', ctrl: ctl.name, cmd: key};
        var exists = seneca.has(cmd);
        seneca.log.info('2/ cmd:', cmd, ' exists', exists, typeof exists);
        expect(exists).to.be.true();
        cbOS();
      }, cbS);
    }, done);
  });

  // it('debug', function (done) {
  //   // var cmd = {role: 'cd-sso', entity: 'app', cmd: 'save', app: fixes['app']};
  //   // console.log('cmd', cmd);
  //   // seneca.act(cmd, function (err, entity) {
  //   //   console.log('err', err);
  //   //   if (err) done(err);
  //   //   console.log(entity);
  //   //   expect(entity.id).to.exist();
  //   //   testedEnt = entity.id;
  //   //   delete entity.id;
  //   //   expect(entity.data$(false)).to.deep.equal(fixes['app']);
  //   //   done();
  //   // });
  //   seneca.act({role: 'cd-users', cmd: 'list', query: {email: 'champion1@example.com'}},
  //   function (err, champ) {
  //     console.log(err, champ);
  //     done();
  //   });
  // });

  it('should save entities with valid payload', function (done) {
    async.eachOfSeries(entities, function (entity, key, cb) {
      var cmd = {role: 'cd-sso', entity: entity.name, cmd: 'save'};
      cmd[key] = _.clone(fixes[entity.name]); // ok, it's a fugly hack
      seneca.act(cmd, function (err, result) {
        if (err) done(err);
        expect(result.id).to.exist();
        expect(result.created_at).to.exist();
        testedEnt[entity.name] = result.id;
        delete result.id;
        delete result.created_at;
        expect(result.data$(false)).to.deep.equal(fixes[entity.name]);
        cb();
      });
    }, done);
  });

  // Explicit perms to avoid forgetting adding some
  it('should have as many perms as there is acts', function (done) {
    var perms = flat(require('../../lib/sso/controllers/perm')());
    var ctrlActs = _.filter(seneca.list(), function (o) { return _.has(o, 'ctrl'); });
    console.log(_.keys(perms).length, ctrlActs.length);
    // This extra check will only be doable once we do https://github.com/CoderDojo/cp-permissions-plugin/issues/8
    // var acts = _.filter(seneca.list(), {cmd: 'check_permissions'});
    // expect(_.keys(perms).length).to.be.equal(acts.length);
    expect(_.keys(perms).length).to.be.equal(ctrlActs.length);
    done();
  });

  it('should save entities via controller with valid payload', function (done) {
    async.eachOfSeries(ctrls, function (entity, key, cb) {
      var cmd = {role: 'cd-sso', ctrl: entity.name, cmd: 'create', user: {id: 42}};
      cmd[key] = _.clone(fixes[entity.name]);
      seneca.act(cmd, function (err, result) {
        if (err) done(err);
        expect(result.id).to.exist();
        expect(result.created_at).to.exist();
        var data = _.pick(result, _.keys(fixes[entity.name]));
        expect(data).to.deep.equal(fixes[entity.name]);
        cb();
      });
    }, done);
  });

  it('should save entities with default values from the controller', function (done) {
    var cmd = {role: 'cd-sso', ctrl: 'app', cmd: 'create'};
    cmd.app = _.clone(fixes.app);
    cmd.user = {id: 43};
    seneca.act(cmd, function (err, result) {
      if (err) return done(err);
      expect(result.transparent).to.be.equal(false);
      done();
    });
  });

  // VALIDATION
  // No need to validate them all, we just want to verify the bootloader (/lib/index)
  it('should validate entities acts with joi', function (done) {
    seneca.act({role: 'cd-sso', entity: 'app', cmd: 'get', id: {}}, function (err, app) {
      expect(err.code).to.be.equal('act_invalid_msg');
      done();
    });
  });

  it('should validate entities acts while promised with joi', function (done) {
    var app = seneca.export('cd-sso/acts')['app'];
    app.get({id: {}})
    .catch(function (err) {
      expect(err.code).to.be.equal('act_invalid_msg');
      done();
    });
  });

  it('should validate controllers acts with joi', function (done) {
    seneca.act({role: 'cd-sso', ctrl: 'app', cmd: 'get', id: {}}, function (err, app) {
      expect(err.code).to.be.equal('act_invalid_msg');
      done();
    });
  });
});
