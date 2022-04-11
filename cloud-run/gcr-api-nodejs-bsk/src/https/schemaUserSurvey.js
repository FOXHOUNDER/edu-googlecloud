'use strict';

const {Joi} = require('./reqValidator.js');

const schema = Joi.object({
  IdTessera: Joi
    .string()
    .required(),

  IdQuestionario: Joi
    .string()
    .required(),

  Questionario: Joi.array().items(
    Joi.object({
      Domanda: Joi.string().required(),
      Risposta: Joi.string().required()
    })
  )
});



module.exports = {
  schema: schema
};