module.exports = function () {
  return function (args, cb) {
    var acts = this.export('cd-sso/acts')[args.ctrl];
    var approval = args.approval;
    acts.save({approval: approval})
    .asCallback(cb);
  };
};
