'use strict';

const {Joi} = require('./reqValidator.js');

const schema = Joi.object({
  IdTessera: Joi
    .string()
    .required(),

});



module.exports = {
  schema: schema
};