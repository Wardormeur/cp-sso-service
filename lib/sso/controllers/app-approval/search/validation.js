var Joi = require('joi');
module.exports = function (definition) {
  return {query: Joi.object().required()};
};
