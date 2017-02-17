var Joi = require('joi');
module.exports = function (definition) {
  return {approval: Joi.object().keys({
    appId: definition.appId.required(),
    token: definition.token.required()
  }),
  user: Joi.object().required()};
};
