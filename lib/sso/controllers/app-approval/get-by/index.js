var Promise = require('bluebird');
/**
 * getBy is a proxy to get which allows any other field that is supposed to return only 1 record
 * but is not an id (ie: email for an user, token for app-approval)
 * @return {[type]} [description]
 */
module.exports = function () {
  return function (args, cb) {
    var Approvals = this.export('cd-sso/acts')[args.ctrl];
    Approvals.search({query: args.query})
    .then(function (approvals) {
      console.log(approvals, args.query);
      if (approvals.length === 1) return Promise.resolve(approvals[0]);
      return Promise.reject(new Error('More than one record returned'));
    })
    .asCallback(cb);
  };
};
