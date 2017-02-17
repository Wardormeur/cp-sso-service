module.exports = function () {
  return function (args, cb) {
    var Approvals = this.export('cd-sso/acts')[args.ctrl];
    var approval = args.approval;
    // TODO : should we revoke the token too ?
    Approvals.search({query: {authorizationCode: approval.authorizationCode, appId: approval.appId}})
    .then(function (foundApprovals) {
      if (foundApprovals.length > 1) throw new Error('More than one approval has been found');
      return Approvals.save({approval: {id: foundApprovals[0].id, authorizationCode: ''}});
    })
    .asCallback(cb);
  };
};
