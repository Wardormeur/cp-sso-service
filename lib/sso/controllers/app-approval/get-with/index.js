var Promise = require('bluebird');
/**
 * getWith is a proxy to get which allows any other field that is supposed to return only 1 record
 * but is not an id (ie: email for an user, token for app-approval)
 * It also returns a complete record based upon cd_v_app_approval instead of cd_app_approval
 * @return {[type]} [description]
 */
module.exports = function () {
  return function (args, cb) {
    var Approvals = this.export('cd-sso/acts')['v-app-approval'];
    console.log(this.export('cd-sso/acts'));

    Approvals.search({query: args.query})
    .then(function (approvals) {
      if (approvals.length === 1) return Promise.resolve(approvals[0]);
      return Promise.reject(new Error('More than one record returned'));
    })
    .asCallback(cb);
  };
};
