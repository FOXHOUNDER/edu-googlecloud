'use strict';

const JSON_VALIDATION_ERRCODE = 400;
const JSON_VALIDATION_ERRDESC = 'Bad Request';

/**
 * Standardize valid http json response
 */
function formValidHttpResponse(result) {
  return {
    status:       result[0].httpResponseCode,
    description:  result[0].httpResponseMessage,
    data:         result[0].data,
    error:        result[1]
  }
};

/**
 * Standardize error http json response
 */
function formErrorHttpResponse(error) {
  return {
    status:       JSON_VALIDATION_ERRCODE,
    description:  JSON_VALIDATION_ERRDESC,
    data:         null,
    error:        {
                    reason: 'invalidRequest',
                    location: 'jsonInputBody',
                    message: error.details[0].message
                  }
  }
};



module.exports = {
  formValidHttpResponse: formValidHttpResponse,
  formErrorHttpResponse: formErrorHttpResponse
};