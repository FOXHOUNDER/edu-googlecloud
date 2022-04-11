'use strict';

const connection = require('../data/connection.js');

async function pauseService(reqTimestamp, IdTessera, DataInizioSospensione, DataFineSospensione, MotivoDichiarato) {
  return new Promise(function(resolve, reject) {
    const tipoRichiesta = 'Sospensione';
    const tableName = 'SERVIZIO_SOSPENSIONE';
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
        api: '_service_pause'
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
          DataInizioSospensione: DataInizioSospensione,
          DataFineSospensione: DataFineSospensione,
          MotivoDichiarato: MotivoDichiarato,
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
            CALL ${connection.API_DATASET}.sp_SospensioneServizio(
              @v_uuid,
              @v_IdTessera,
              @v_DataInizioSospensione,
              @v_DataFineSospensione,
              @v_MotivoDichiarato
            );
          `;

          const options = {
            location: 'EU',
            priority: 'INTERACTIVE',
            jobPrefix: "API_",
            labels: {
              api: '_service_pause'
            },
            query: sqlStatement,
            useLegacySql: false,
            parameterMode: 'NAMED',
            params: {
              v_uuid: row.data[0]._id,
              v_IdTessera: IdTessera,
              v_DataInizioSospensione: connection.bq.date(DataInizioSospensione),
              v_DataFineSospensione: connection.bq.date(DataFineSospensione),
              v_MotivoDichiarato: MotivoDichiarato
            },
            types: {
              v_uuid: 'STRING',
              v_IdTessera: 'STRING',
              v_DataInizioSospensione: 'STRING',
              v_DataFineSospensione: 'STRING',
              v_MotivoDichiarato: 'STRING'
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
        }
      });
  });
}



module.exports = pauseService;