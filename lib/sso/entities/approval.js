var Joi = require('joi');
module.exports = function () {
  var seneca = this;
  var name = 'app-approval';
  var domain = 'cd';
  //TODO: to snakeCase
  var orm = seneca.make$(domain, 'app_approval');
  return {
    name: name,
    domain: domain,
    acts: {
      get: {
        validation: {id: Joi.string()
        },
        cb: function (args, cb) {
          orm.load$(args.id, cb);
        }
      },
      search: {
        validation: {query: Joi.object().required()},
        cb: function (args, cb) {
          console.log(args);
          orm.list$(args.query, cb);
        }
      },
      save: {
        validation: {approval: Joi.object().required()},
        cb: function (args, cb) {
          orm.save$(args.approval, cb);
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
