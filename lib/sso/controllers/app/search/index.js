var Promise = require('bluebird');
module.exports = function () {
  return function (args, cb) {
    var acts = this.export('cd-sso/acts')[args.ctrl];
    acts.search({query: args.query})
    .then(cb)
    .catch(cb)
    // .asCallback(cb, {spread: true});
  };
};
