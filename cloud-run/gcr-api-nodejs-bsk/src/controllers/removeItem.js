'use strict';

const connection = require('../data/connection.js');

async function removeItem(reqTimestamp, IdTessera, IdOrdine, IdProdottoWeb, IdMotivazione) {
  return new Promise(function(resolve, reject) {
    const tableName = 'ORDINE_RIMOZIONE_PRODOTTO';
    const uuid = connection.uuid.v4();
    const API_TARGET_TABLE = connection.bq.dataset(connection.API_DATASET).table(tableName);
    const record = {
      _id: uuid,
      IdTessera: IdTessera,
      IdOrdine: IdOrdine,
      IdProdottoWeb: IdProdottoWeb,
      IdMotivazione: IdMotivazione,
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
          CALL ${connection.API_DATASET}.sp_RimozioneProdotto(
            @v_uuid,
            @v_IdTessera,
            @v_IdOrdine,
            @v_IdProdottoWeb,
            @v_IdMotivazione
          );
        `;

        const options = {
          location: 'EU',
          priority: 'BATCH',
          jobPrefix: "API_",
          labels: {
            api: '_order_remove_item'
          },
          query: sqlStatement,
          useLegacySql: false,
          parameterMode: 'NAMED',
          params: {
            v_uuid: uuid,
            v_IdTessera: IdTessera,
            v_IdOrdine: IdOrdine,
            v_IdProdottoWeb: IdProdottoWeb,
            v_IdMotivazione: IdMotivazione
          },
          types: {
            v_uuid: 'STRING',
            v_IdTessera: 'STRING',
            v_IdOrdine: 'STRING',
            v_IdProdottoWeb: 'STRING',
            v_IdMotivazione: 'STRING'
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



module.exports = removeItem;