var Promise = require('bluebird');
module.exports = function () {
  return function (args, cb) {
    var acts = this.export('cd-sso/acts')[args.ctrl];
    var app = args.app;
    acts.save({app: app})
    .then(cb)
    .catch(cb);
  };
};
