/**
 * Delete an app and all corresponding approvals
 * @param  {String} id App Id
 */
var Promise = require('bluebird');
module.exports = function (acts) {
  return function (args, cb) {
    var acts = this.export('cd-sso/acts')[args.ctrl];
    var id = args.id;
    acts.deleteApp({id: id})
    .then(function () {
      return acts.searchApprovals({app: id})
      .each(function (approval) {
        acts.deleteApproval({id: approval.id});
      });
    })
    .then(cb)
    .catch(cb);
  };
};
