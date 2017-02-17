var Joi = require('joi');

module.exports = function () {
  var seneca = this;
  var name = 'app-approval';
  var domain = 'cd-sso';
  var plugin = 'cd_app_approval';

  var definition = {
    id: Joi.string(),
    appId: Joi.string(),
    userId: Joi.string(),
    token: Joi.string(),
    expiresAt: Joi.date(),
    authorizationCode: Joi.string()
  };

  return {
    name: name,
    domain: domain,
    plugin: plugin,
    definition: definition,
    // TODO : glob
    acts: {
      get: {
        validation: require('./get/validation')(definition),
        cb: require('./get').bind(this)()
      },
      getBy: {
        validation: require('./get-by/validation')(definition),
        cb: require('./get-by').bind(this)()
      },
      getWith: {
        validation: require('./get-with/validation')(definition),
        cb: require('./get-with').bind(this)()
      },
      search: {
        validation: require('./search/validation')(definition),
        cb: require('./search').bind(this)()
      },
      create: {
        validation: require('./create/validation')(definition),
        cb: require('./create').bind(this)()
      },
      update: {
        validation: require('./update/validation')(definition),
        cb: require('./update').bind(this)()
      },
      revokeAuthCode: {
        validation: require('./revoke-auth-code/validation')(definition),
        cb: require('./revoke-auth-code').bind(this)()
      },
      delete: {
        validation: require('./delete/validation')(definition),
        cb: require('./delete').bind(this)()
      }
    }
  };
};
