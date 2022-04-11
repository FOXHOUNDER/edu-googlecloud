'use strict';

const connection = require('../data/connection.js');

async function planningCalendar(reqTimestamp, IdTessera, DataInizioPianificazione) {
  return new Promise(function(resolve, reject) {
    const tableName = 'ORDINE_CALENDARIO_PIANIFICAZIONE';
    const sqlStatement = `
      CALL ${connection.API_DATASET}.sp_CalendarioPianificazione (
        @v_IdTessera,
        @v_DataInizioPianificazione
      );
    `;

    const options = {
      location: 'EU',
      priority: 'INTERACTIVE',
      jobPrefix: 'API_',
      labels: {
        api: '_order_planning_calendar'
      },
      query: sqlStatement,
      useLegacySql: false,
      parameterMode: 'NAMED',
      params: {
        v_IdTessera: IdTessera,
        v_DataInizioPianificazione: connection.bq.date(DataInizioPianificazione === null ? '1900-01-01' : DataInizioPianificazione)
      },
      types: {
        v_IdTessera: 'STRING',
        v_DataInizioPianificazione: 'DATE'
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
          DataInizioPianificazione: DataInizioPianificazione,
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



module.exports = planningCalendar;