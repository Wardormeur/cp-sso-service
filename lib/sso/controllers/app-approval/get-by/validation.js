var Joi = require('joi');
module.exports = function (definition) {
  return {query: Joi.alternatives().try(
    Joi.object().keys({token: definition.token}),
    Joi.object().keys({authorizationCode: definition.authorizationCode}),
    Joi.object().keys({appId: definition.appId, userId: definition.userId})
  )};
};
