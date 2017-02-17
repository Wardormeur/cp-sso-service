module.exports = function () {
  return function (args, cb) {
    var acts = this.export('cd-sso/acts')[args.ctrl];
    console.log('app-approval', args);
    acts.search({query: args.query})
    .asCallback(cb);
  };
};
