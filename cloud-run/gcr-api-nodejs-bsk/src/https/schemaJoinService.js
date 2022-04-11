'use strict';

const {Joi} = require('./reqValidator.js');

const schema = Joi.object({
  IdTessera: Joi
    .string()
    .required(),
  
  IdProfiloWeb: Joi
    .string()
    .required(),

  IdIndirizzoWeb: Joi
    .string()
    .required(),
  
  PreferenzaGiorno: Joi
    .string()
    .valid('Lun','Mar','Mer','Gio','Ven','Sab','Dom')
    .required(),

  PreferenzaFasciaOraria: Joi
    .string()
    .valid('142','143','144','145','146','147')
    .required(),

  BudgetSettimanale: Joi
    .number()
    .integer()
    .required(),

  FlagsPrivacy: Joi.array().items(
    Joi.object({
      Key: Joi.string().required(),
      Value: Joi.boolean().required()
    })
  )
});



module.exports = {
  schema: schema
};