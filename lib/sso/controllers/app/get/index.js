var Promise = require('bluebird');
module.exports = function () {
  return function (args, cb) {
    var acts = this.export('cd-sso/acts')[args.ctrl];
    acts.get({id: args.id})
    .then(function (app) {
      cb(null, app);
    })
    .catch(cb);
  };
};
