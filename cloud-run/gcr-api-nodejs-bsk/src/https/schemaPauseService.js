'use strict';

const {Joi} = require('./reqValidator.js');

const schema = Joi.object({
  IdTessera: Joi
    .string()
    .required(),

  DataInizioSospensione: Joi
    .date().iso()
    .required(),

  DataFineSospensione: Joi
    .date().iso()
    .min(Joi.ref('DataInizioSospensione'))
    .required(),

  MotivoDichiarato: Joi
    .string()
});



module.exports = {
  schema: schema
};