var Joi = require('joi');
module.exports = function () {
  var seneca = this;
  var name = 'app';
  var domain = 'cd';
  var orm = seneca.make$(domain, name);
  //  TODO: export to make reusable by cp-zen
  //  TODO : change postgrator to knex for unified migration ?
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
    fields: Joi.array(),
    transparent: Joi.number()
  };

  return {
    name: name,
    domain: domain,
    definition: definition,
    acts: {
      get: {
        validation: {id: definition.id.required()},
        cb: function (args, cb) {
          orm.load$(args.id, cb);
        }
      },
      search: {
        validation: {query: Joi.object().required()},
        cb: function (args, cb) {
          orm.list$(args.query, cb);
        }
      },
      save: {
        validation: {app: Joi.object().required()},
        cb: function (args, cb) {
          console.log('payload', args.app);
          orm.save$(args.app, cb);
        }
      },
      delete: {
        validation: {id: Joi.string()},
        cb: function (args, cb) {
          orm.remove$(args.id, cb);
        }
      }
    }
  };
};
