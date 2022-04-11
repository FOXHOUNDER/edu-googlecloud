'use strict';

const connection = require('../data/connection.js');

async function userEligibility(reqTimestamp, IdTessera) {
  return new Promise(function(resolve, reject) {
    const tableName = 'UTENTE_IDONEITA';
    const sqlStatement = `
      CALL ${connection.API_DATASET}.sp_IdoneitaUtente (
        @v_IdTessera
      );
    `;

    const options = {
      location: 'EU',
      priority: 'INTERACTIVE',
      jobPrefix: 'API_',
      labels: {
        api: '_user_eligibility'
      },
      query: sqlStatement,
      useLegacySql: false,
      parameterMode: 'NAMED',
      params: {
        v_IdTessera: IdTessera
      },
      types: {
        v_IdTessera: 'STRING'
      },
    };

    // Calls sp to compute resp
    connection.bq.createQueryStream(options)
      .on('error', function(err) {
        reject([connection.BIGQUERY_ERROR_RESPONSE, err.errors]);
      })
      .on('data', function(row) {
        // Sends back resp asap
        resolve([row, null]);

        // Async comp: streams req in LV00 (log purp.)
        const API_TARGET_TABLE = connection.bq.dataset(connection.API_DATASET).table(tableName);
        const record = {
          _id: row.data[0]._id,
          IdTessera: IdTessera,
          IdoneitaServizio: row.data[0].IdoneitaServizio,
          _httpResponseCode: row.httpResponseCode,
          _httpResponseMessage: row.httpResponseMessage,
          _httpResponseTime: (Date.now() - reqTimestamp),
          _loadingDate: connection.bq.timestamp(new Date())
        };

        API_TARGET_TABLE.insert(record)
          .then((data) => { console.info(`Request ${row.data[0]._id} has been registered with success in ${connection.API_DATASET}.${tableName}`) })
          .catch((err) => { console.error(`Request ${row.data[0]._id} has failed to register with error: ${err.errors[0].errors[0]}`) });
      });
  });
}



module.exports = userEligibility;