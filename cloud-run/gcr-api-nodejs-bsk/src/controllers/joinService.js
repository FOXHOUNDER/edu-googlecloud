'use strict';

const connection = require('../data/connection.js');

async function joinService(reqTimestamp, IdTessera, IdProfiloWeb, IdIndirizzoWeb, PreferenzaGiorno, PreferenzaFasciaOraria, BudgetSettimanale, FlagsPrivacy) {  
  return new Promise(function(resolve, reject) {
    const tipoRichiesta = 'Adesione';
    const tableName = 'SERVIZIO_ADESIONE';
    const sqlStatement = `
      CALL ${connection.API_DATASET}.sp__ValidazioneRichiestaServizio(
        @v_TipoRichiesta,
        @v_IdTessera
      );
    `;

    const options = {
      location: 'EU',
      priority: 'INTERACTIVE',
      jobPrefix: 'API_',
      labels: {
        api: '_service_join'
      },
      query: sqlStatement,
      useLegacySql: false,
      parameterMode: 'NAMED',
      params: {
        v_TipoRichiesta: tipoRichiesta,
        v_IdTessera: IdTessera
      },
      types: {
        v_TipoRichiesta: 'STRING',
        v_IdTessera: 'STRING'
      },
    };

    // Calls sp to compute resp (N.B. returns only outcomes of checks)
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
          IdProfiloWeb: IdProfiloWeb,
          IdIndirizzoWeb: IdIndirizzoWeb,
          PreferenzaGiorno: PreferenzaGiorno,
          PreferenzaFasciaOraria: PreferenzaFasciaOraria,
          BudgetSettimanale: BudgetSettimanale,
          FlagsPrivacy: FlagsPrivacy,
          _httpResponseCode: row.httpResponseCode,
          _httpResponseMessage: row.httpResponseMessage,
          _httpResponseTime: (Date.now() - reqTimestamp),
          _loadingDate: connection.bq.timestamp(new Date())
        };

        API_TARGET_TABLE.insert(record)
          .then((data) => { console.info(`Request ${row.data[0]._id} has been registered with success in ${connection.API_DATASET}.${tableName}`) })
          .catch((err) => { console.error(`Request ${row.data[0]._id} has failed to register with error: ${err.errors[0].errors[0]}`) });

        // Async comp: prepares and runs batch job
        if(row.httpResponseCode === 200) {
          const sqlStatement = `
            CALL ${connection.API_DATASET}.sp_AdesioneServizio(
              @v_uuid,
              @v_IdTessera,
              @v_IdProfiloWeb,
              @v_IdIndirizzoWeb,
              @v_PreferenzaGiorno,
              @v_PreferenzaFasciaOraria,
              @v_BudgetSettimanale,
              @v_FlagsPrivacy
            );
          `;

          const options = {
            location: 'EU',
            priority: 'INTERACTIVE',
            jobPrefix: "API_",
            labels: {
              api: '_service_join'
            },
            query: sqlStatement,
            useLegacySql: false,
            parameterMode: 'NAMED',
            params: { 
              v_uuid: row.data[0]._id,
              v_IdTessera: IdTessera,
              v_IdProfiloWeb: IdProfiloWeb,
              v_IdIndirizzoWeb: IdIndirizzoWeb,
              v_PreferenzaGiorno: PreferenzaGiorno,
              v_PreferenzaFasciaOraria: PreferenzaFasciaOraria,
              v_BudgetSettimanale: BudgetSettimanale,
              v_FlagsPrivacy: FlagsPrivacy
            },
            types: {
              v_uuid: 'STRING',
              v_IdTessera: 'STRING',
              v_IdProfiloWeb: 'STRING',
              v_IdIndirizzoWeb: 'STRING',
              v_PreferenzaGiorno: 'STRING',
              v_PreferenzaFasciaOraria: 'STRING',
              v_BudgetSettimanale: 'NUMERIC',
              v_FlagsPrivacy: [{
                Key: 'STRING',
                Value: 'BOOL'
              }]
            }
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
        }
      });
  });
}



module.exports = joinService;