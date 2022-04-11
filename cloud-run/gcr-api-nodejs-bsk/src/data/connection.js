/**
 * Module to manage connection with BigQuery
 *  exports: client conn to bigquery (bq)
 *  exports: dataset for the API (API_DATASET) to be config. in gcr as ENV. (default: LV00_APPLICATION)
 *  exports: timeout (ms) to wait for the API res (API_TIMEOUT_MS) to be config. in gcr as ENV. (default: 5s)
 */

'use strict';

const {BigQuery} = require('@google-cloud/bigquery');
const uuid = require("uuid");

const bigquery = new BigQuery();

const API_DATASET = process.env.API_DATASET || 'LV00_APPLICATION';
const API_TIMEOUT_MS = process.env.API_TIMEOUT_MS || 5000;
const API_SUCCESS_RESCODE = 200;
const API_SUCCESS_RESDESC = "Request processed with success";
const BIGQUERY_ERRCODE = 500;
const BIGQUERY_ERRDESC = 'Internal Server Error';

const API_STREAM_DEFAULT_RESPONSE = {
  httpResponseCode: API_SUCCESS_RESCODE,
  httpResponseMessage: API_SUCCESS_RESDESC,
  data: 'TBD'
};

const BIGQUERY_ERROR_RESPONSE = {
  httpResponseCode: BIGQUERY_ERRCODE,
  httpResponseMessage: BIGQUERY_ERRDESC,
  data: null
};



module.exports = {
  bq: bigquery,
  uuid: uuid,
  API_DATASET: API_DATASET,
  API_TIMEOUT_MS: API_TIMEOUT_MS,
  API_STREAM_DEFAULT_RESPONSE: API_STREAM_DEFAULT_RESPONSE,
  BIGQUERY_ERROR_RESPONSE: BIGQUERY_ERROR_RESPONSE
};