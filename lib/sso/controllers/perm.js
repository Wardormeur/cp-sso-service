var glob = require('glob');
var _ = require('lodash');
var path = require('path');
/**
 * Aggregate all permissions functions/imports into one for cp-perm
 * @return {Object} Extend of all perms
 */
module.exports = function () {
  var perms = {'cd-sso': {}};
  // the /*/** focus on anything at least one level beyond itself
  var files = glob.sync('./*/**/perm.js', {cwd: __dirname});
  _.each(files, function (file) {
    var ctrl = file.split(path.sep)[1]; // 0 = ., 1 = ctrlName
    var perm = require(file);
    if (!perms['cd-sso'][ctrl]) perms['cd-sso'][ctrl] = {};
    if (typeof (perm) === 'function') {
      perms['cd-sso'][ctrl] = _.extend(perms['cd-sso'][ctrl], perm());
    } else {
      perms['cd-sso'][ctrl] = _.extend(perms['cd-sso'][ctrl], perm);
    }
  });
  return perms;
};
