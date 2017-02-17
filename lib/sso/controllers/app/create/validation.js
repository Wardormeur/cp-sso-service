var Joi = require('joi');
module.exports = function (definition) {
  return {app: Joi.object().keys({
    name: definition.name.required(),
    url: definition.url.required(),
    callbackUrl: definition.callbackUrl.required(),
    iconUrl: definition.iconUrl,
    tosUrl: definition.tosUrl.required(),
    privacyUrl: definition.privacyUrl.required(),
    secretKey: definition.secretKey.required(),
    fields: definition.fields.required()
  })};
};
