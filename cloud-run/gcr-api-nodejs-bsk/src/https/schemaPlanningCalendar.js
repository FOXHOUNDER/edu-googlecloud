'use strict';

const {Joi} = require('./reqValidator.js');

const schema = Joi.object({
  IdTessera: Joi
    .string()
    .required(),

  DataInizioPianificazione: Joi
    .date().iso()
});



module.exports = {
  schema: schema
};