module.exports = function () {
  return function (args, cb) {
    var Approvals = this.export('cd-sso/acts')[args.ctrl];
    var approval = args.approval;
    approval.userId = args.user.id;
    approval.createdAt = new Date();
    Approvals.save({approval: approval})
    .asCallback(cb);
  };
};
