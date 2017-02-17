/**
 * Act to retrieve data for an user given a token
 * @param  {string}   token the approval token
 * @return {Object}        the user data
 */
module.exports = function (args, done) {
  var seneca = this;
  var token = args.token;
  // get fields for the following token
  async.waterfall([
    getApproval,
    getAppFields,
    getDataForFields
  ], done);
  function getApproval (wfCb) {
    seneca.act({role: 'approval', cmd: 'list', token: token}, function (err, approvals) {
      if (approvals.length > 1) return done(new Error('Too many approval returned for the same token'));
      return wfCb(null, approval[0]);
    });
  }
  function getAppFields (approval, wfCb) {
    seneca.act({role: 'app', cmd: 'load', id: approval.id}, function () {
      return wfCb(null, approval, app);
    });
  }
  function getDataForFields (app, wfCb) {
    seneca.act({role: 'cd-user-profile', cmd: 'load', id: app.id, fields: app.fields}, function (err, data) {
      if (!data || err) return done(new Error('No data found for data'));
    });
  }
};
