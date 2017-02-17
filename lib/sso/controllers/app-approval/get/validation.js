var Joi = require('joi');
module.exports = function (definition) {
  return {id: Joi.string().required()};
};
