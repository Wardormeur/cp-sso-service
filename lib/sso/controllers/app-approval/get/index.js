module.exports = function () {
  return function (args, cb) {
    var Approvals = this.export('cd-sso/acts')[args.ctrl];
    Approvals.get({id: args.id})
    .asCallback(cb);
  };
};
