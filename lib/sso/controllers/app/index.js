var Joi = require('joi');

module.exports = function () {
  var seneca = this;
  var name = 'app';
  var domain = 'cd-sso';
  var plugin = 'cd-app';
  var scopes = ['profile', 'profile.email', 'profile.children', 'profile.dojos'];
  seneca.context.MAX_HISTORY = 3;
  seneca.context.TRANSPARENT = false;

  var definition = {
    id: Joi.string(),
    creatorId: Joi.string(),
    name: Joi.string(),
    url: Joi.string(),
    callbackUrl: Joi.string(),
    iconUrl: Joi.string(),
    tosUrl: Joi.string(),
    privacyUrl: Joi.string(),
    secretKey: Joi.string(),
    fields: Joi.array().items(Joi.string().required().valid(scopes)),
    maxHistory: Joi.string(),
    transparent: Joi.number()
  };

  return {
    name: name,
    plugin: plugin,
    domain: domain,
    definition: definition,
    acts: {
      get: {
        validation: require('./get/validation')(definition),
        cb: require('./get').bind(this)()
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
      delete: {
        validation: require('./delete/validation')(definition),
        cb: require('./delete').bind(this)()
      }
    }
  };
};
