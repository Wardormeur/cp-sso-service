var Joi = require('joi');
module.exports = function () {
  var seneca = this;
  var name = 'v-app-approval';
  var domain = 'cd';
  var orm = seneca.make$(domain, 'v_app_approval');
  return {
    name: name,
    domain: domain,
    acts: {
      get: {
        validation: {
          query: Joi.alternatives().try(
            Joi.object().keys({appId: Joi.string().required(), token: Joi.string().required()}),
            Joi.object().keys({approvalId: Joi.string().required()})
          )
        },
        cb: function (args, cb) {
          orm.load$(args.id, cb);
        }
      },
      search: {
        validation: {query: Joi.object().required()},
        cb: function (args, cb) {
          orm.list$(args.query, cb);
        }
      }
    }
  };
};
