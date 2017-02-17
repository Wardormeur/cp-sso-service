var Joi = require('joi');
module.exports = function (definition) {
  return {app: Joi.object().keys({
    id: definition.id.required(),
    name: definition.name.required(),
    url: definition.url.required(),
    callbackUrl: definition.callbackUrl.optional(),
    iconUrl: definition.iconUrl,
    tosUrl: definition.tosUrl,
    privacyUrl: definition.privacyUrl
  })};
};
