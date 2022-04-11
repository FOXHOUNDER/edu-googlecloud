'use strict';

const {Joi} = require('./reqValidator.js');

const schema = Joi.object({
  IdTessera: Joi
    .string()
    .required(),

  MotivoDichiarato: Joi
    .string()
});



module.exports = {
  schema: schema
};