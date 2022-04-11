'use strict';

const {Joi} = require('./reqValidator.js');

const schema = Joi.object({
  IdTessera: Joi
    .string()
    .required(),

  IdOrdine: Joi
    .string()
    .required(),

  IdMotivazione: Joi
    .string()
});



module.exports = {
  schema: schema
};