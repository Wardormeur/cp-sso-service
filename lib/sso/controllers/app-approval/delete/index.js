module.exports = function () {
  return function (args, cb) {
    var Approvals = this.export('cd-sso/acts')[args.ctrl];
    var id = args.id;
    Approvals.delete(id)
    .asCallback(cb);
  };
};
