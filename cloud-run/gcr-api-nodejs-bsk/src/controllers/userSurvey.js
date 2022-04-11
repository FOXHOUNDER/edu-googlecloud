'use strict';

const connection = require('../data/connection.js');

async function userSurvey(reqTimestamp, IdTessera, IdQuestionario, Questionario) {
  return new Promise(function(resolve, reject) {
    const tableName = 'UTENTE_QUESTIONARIO';
    const uuid = connection.uuid.v4();
    const API_TARGET_TABLE = connection.bq.dataset(connection.API_DATASET).table(tableName);
    const record = {
      _id: uuid,
      IdTessera: IdTessera,
      IdQuestionario: IdQuestionario,
      Questionario: Questionario,
      _httpResponseCode: connection.API_STREAM_DEFAULT_RESPONSE.httpResponseCode,
      _httpResponseMessage: connection.API_STREAM_DEFAULT_RESPONSE.httpResponseMessage,
      _httpResponseTime: (Date.now() - reqTimestamp),
      _loadingDate: connection.bq.timestamp(new Date())
    };

    // Streams req in LV00 (log purp.)
    API_TARGET_TABLE.insert(record)
      .then((data) => {
        console.info(`Request ${uuid} has been registered with success in ${connection.API_DATASET}.${tableName}`) 
        let apiResponse = connection.API_STREAM_DEFAULT_RESPONSE;
        apiResponse.data = [{_id: uuid, IdTessera: IdTessera}];
        // Sends back resp asap (default resp 200, actual processing is performed via async batch later on)
        resolve([apiResponse, null]);
        
        // Async comp: prepares and runs batch job
        const sqlStatement = `
          CALL ${connection.API_DATASET}.sp_QuestionarioUtente (
            @v_uuid,
            @v_IdTessera,
            @v_IdQuestionario,
            @v_Questionario
          );
        `;

        const options = {
          location: 'EU',
          priority: 'BATCH',
          jobPrefix: "API_",
          labels: {
            api: '_user_survey'
          },
          query: sqlStatement,
          useLegacySql: false,
          parameterMode: 'NAMED',
          params: {
            v_uuid: uuid,
            v_IdTessera: IdTessera,
            v_IdQuestionario: IdQuestionario,
            v_Questionario: Questionario
          },
          types: {
            v_uuid: 'STRING',
            v_IdTessera: 'STRING',
            v_IdQuestionario: 'STRING',
            v_Questionario: [{
              Domanda: 'STRING',
              Risposta: 'STRING'
            }]
          },
        };

        connection.bq.createQueryJob(options)
          .then((data) => {
            const job = data[0];
            const apiResponse = data[1];
            console.info(`Job ${job.id} has started.`);
            if(LOG_LEVEL<2) console.debug(apiResponse.configuration.query.queryParameters);
            // to actually get job's results: resolve(job.getQueryResults({timeoutMs: connection.API_TIMEOUT_MS})
          })
          .catch((err) => {
            console.error(`Job creation has failed! ${err}`);
            const error = err.toString();
          })
      })
      .catch((err) => {
        if (err.name === 'PartialFailureError')
          // 1+ rows failed to insert
          err = err.errors[0].errors[0];
        else
          // auth error or something not query-related
          err = err.errors[0];
        console.error(`Request ${uuid} has failed to register with error: ${err}`)
        reject([connection.BIGQUERY_ERROR_RESPONSE, err]);
      });
  });
}



module.exports = userSurvey;