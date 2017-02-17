var Joi = require('joi');
module.exports = function (definition) {
  return {approval: Joi.object().keys({
    appId: definition.appId.required(),
    authorizationCode: definition.authorizationCode.required(),
    expiresAt: definition.expiresAt.required()
  }),
  user: Joi.object().required()};
};
