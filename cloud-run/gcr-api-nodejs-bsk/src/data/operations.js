'use strict';

/**
 * Return NULL if the obj in input is undefined (applies to every optional field)
 * Used to pass correctly NULL values to bq procedures (undefined != null)
 */
function optValueToNull(obj){
  if(typeof obj === 'undefined')
    return null;
  return obj;
};



module.exports = {
  optValueToNull: optValueToNull
};