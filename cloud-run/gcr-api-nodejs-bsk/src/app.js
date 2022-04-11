'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const ctrl        = require('./controllers');
const data        = require('./data');
const https       = require('./https');

const app  = express();
const port = process.env.PORT || 8080;
const root = process.env.API_ROOT || '/api';
const allowed_ips = IP_WHITELIST.split(',');

// ------------------------------------------------------------------------------------------------
// Middlewares ------------------------------------------------------------------------------------
app.use(bodyParser.json());
app.use(`${root}/about`, express.static('./doc'));
app.set('trust proxy', 'linklocal'); // document. https://expressjs.com/en/guide/behind-proxies.html
                                     // WHY: in prod, we are behind Docker's own network, hence the only IP that express sees is something like ::ffff:169.254.8.129 (req.connection.remoteAddress)
                                     //      this istr. tells express about the proxy, and sets req.ip and req.ips to the left-most entry in the X-Forwarded-* header, ignoring linklocal subnet
app.use(function (req, res, next) {
  console.log(`Received req from ${req.ips}`);
  if (allowed_ips.some(i => req.ips.includes(i)))
    next()
  else res.status(403).json({error: 'Access denied'});
});

// ------------------------------------------------------------------------------------------------
// Routes -----------------------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`<REDACTED>-<REDACTED> REST API listening on port ${port} ..`)
});

app.get(`/`, async(req, res) => {
  res.json({status: 'The cake is a lie..'});
});

app.get(`${root}`, async(req, res) => {
  res.json({status: 'Looking for something? Try /api/{DOMAIN}/{API_NAME} or head to /api/about'})
});

/** -----------------------------------------------------------------------------------------------
 * @api {post} /service/join Richiesta Adesione
 * @apiName POST.joinService
 * @apiGroup Service
 * @apiParam {String} IdTessera Id tessera del cliente
 * @apiParam {String} IdProfiloWeb Id profilo web del portale <REDACTED>
 * @apiParam {String} IdIndirizzoWeb Id indirizzo web (di consegna) del portale <REDACTED>
 * @apiParam {String="Lun","Mar","Mer","Gio","Ven","Sab","Dom"} PreferenzaGiorno Preferenza sul giorno di consegna del box
 * @apiParam {String="142","143","144","145","146","147"} PreferenzaFasciaOraria Preferenza sulla fascia oraria di consegna del box (IdTimeslot)
 * @apiParam {Number} BudgetSettimanale Budget settimanale di spesa indicato per la generazione del box
 * @apiParam {String} FlagsPrivacy[Key] Nome identificativo del flag (e.g. Consenso al Trattamento ..)
 * @apiParam {Boolean} FlagsPrivacy[Value] Valore true/false
 * @apiParamExample {json} Request-Example:
 *    "IdTessera": "<REDACTED>-0001",
 *    "IdProfiloWeb": "<REDACTED>-WEB-0001",
 *    "IdIndirizzoWeb": "123",
 *    "PreferenzaGiorno": "Lun",
 *    "PreferenzaFasciaOraria": "145",
 *    "BudgetSettimanale": 50,
 *    "FlagsPrivacy": [
 *      {
 *        "Key": "Adesione al servizio <REDACTED>",
 *        "Value": true
 *      }
 *    ]
 * @apiHeader (Authorization) {String} Authorization Identity-Token del service account fornito (Oct.2020: Dismissed)
 * @apiHeaderExample {json} Header-Example:
 *    "Authorization": "Bearer eyJhbGciOi...FpD3UyQ"
 * @apiSuccess {Number} status Codice di successo
 * @apiSuccess {String} description Descrizione del codice di successo
 * @apiSuccess {String} data Dati chiave del record appena inserito
 * @apiSuccess {String=null} error Elenco errori riscontrati
 * @apiSuccessExample {json} Success-Response:
 *    "status": 200,
 *    "description": "Request processed with success",
 *    "data": [
 *      {
 *        "_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
 *        "IdTessera": "<REDACTED>-0001"
 *      }
 *    ],
 *    "error": null
 * @apiError (Error 4xx, Error 6xx) {Number} status Codice di errore
 * @apiError (Error 4xx, Error 6xx) {String} description Descrizione del codice di errore
 * @apiError (Error 4xx, Error 6xx) {String} data Dati chiave del record appena inserito
 * @apiError (Error 4xx, Error 6xx) {String} error Elenco errori riscontrati
 * @apiErrorExample {json} Error-Response:
 *    "status": 400,
 *    "description": "Bad Request",
 *    "data": null,
 *    "error": {
 *      "reason": "invalidRequest",
 *      "location": "jsonInputBody",
 *      "message": "\"BudgetSettimanale\" must be an integer"
 *    }
 * @apiErrorExample {json} Error-Response:
 *    "status": 601,
 *    "description": "La tessera non è censita a sistema",
 *    "data": [
 *      {
 *        "_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
 *        "IdTessera": "<REDACTED>-0001"
 *      }
 *    ],
 *    "error": null
 */
app.post(`${root}/service/join/`, async(req, res) => {
  const reqTimestamp = new Date();
  if(LOG_LEVEL<2) console.info(`Received request at ${root}/service/join/`);
  const {error, value} = https.joinService.schema.validate(req.body);
  if(error) {
    if(LOG_LEVEL<2) console.error(`Validation failed with error ${error.details[0].message}`);
    res.status(400).json(https.httpResponse.formErrorHttpResponse(error));
  } else {
    ctrl.joinService(
      reqTimestamp,
      req.body.IdTessera,
      req.body.IdProfiloWeb,
      req.body.IdIndirizzoWeb,
      req.body.PreferenzaGiorno,
      req.body.PreferenzaFasciaOraria,
      req.body.BudgetSettimanale,
      req.body.FlagsPrivacy
    )
      .then ((result) => { res.status(200).json(https.httpResponse.formValidHttpResponse(result)); })
      .catch((result) => { res.status(500).json(https.httpResponse.formValidHttpResponse(result)); })
  }
});


/** -----------------------------------------------------------------------------------------------
 * @api {post} /service/pause Richiesta Sospensione
 * @apiName POST.PauseService
 * @apiGroup Service
 * @apiParam {String} IdTessera Id tessera del cliente
 * @apiParam {Date} DataInizioSospensione Data di inizio della sospensione del servizio
 * @apiParam {Date} DataFineSospensione Data di fine della sospensione del servizio
 * @apiParam {String} [MotivoDichiarato] Motivo fornito dal cliente per la sospensione del servizio (testo libero)
 * @apiParamExample {json} Request-Example:
 *    "IdTessera": "<REDACTED>-0001",
 *    "DataInizioSospensione": "2020-08-01",
 *    "DataFineSospensione": "2020-09-01",
 *    "MotivoDichiarato": "Ferie"
 * @apiHeader (Authorization) {String} Authorization Identity-Token del service account fornito (Oct.2020: Dismissed)
 * @apiHeaderExample {json} Header-Example:
 *    "Authorization": "Bearer eyJhbGciOi...FpD3UyQ"
 * @apiSuccess {Number} status Codice di successo
 * @apiSuccess {String} description Descrizione del codice di successo
 * @apiSuccess {String} data Dati chiave del record appena inserito
 * @apiSuccess {String=null} error Elenco errori riscontrati
 * @apiSuccessExample {json} Success-Response:
 *    "status": 200,
 *    "description": "Request processed with success",
 *    "data": [
 *      {
 *        "_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
 *        "IdTessera": "<REDACTED>-0001"
 *      }
 *    ],
 *    "error": null
 * @apiError (Error 4xx, Error 6xx) {Number} status Codice di errore
 * @apiError (Error 4xx, Error 6xx) {String} description Descrizione del codice di errore
 * @apiError (Error 4xx, Error 6xx) {String} data Dati chiave del record appena inserito
 * @apiError (Error 4xx, Error 6xx) {String} error Elenco errori riscontrati
 * @apiErrorExample {json} Error-Response:
 *    "status": 400,
 *    "description": "Bad Request",
 *    "data": null,
 *    "error": {
 *      "reason": "invalidRequest",
 *      "location": "jsonInputBody",
 *      "message": "\"DataFineSospensione\" must be greater than or equal to \"DataInizioSospensione\""
 *    }
 * @apiErrorExample {json} Error-Response:
 *    "status": 601,
 *    "description": "La tessera non è censita a sistema",
 *    "data": [
 *      {
 *        "_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
 *        "IdTessera": "<REDACTED>-0001"
 *      }
 *    ],
 *    "error": null
 */
app.post(`${root}/service/pause/`, async(req, res) => {
  const reqTimestamp = new Date();
  if(LOG_LEVEL<2) console.info(`Received request at ${root}/service/pause/`);
  const {error, value} = https.pauseService.schema.validate(req.body);
  if(error) {
    if(LOG_LEVEL<2) console.error(`Validation failed with error ${error.details[0].message}`);
    res.status(400).json(https.httpResponse.formErrorHttpResponse(error));
  } else {
    ctrl.pauseService(
      reqTimestamp,
      req.body.IdTessera,
      req.body.DataInizioSospensione,
      req.body.DataFineSospensione,
      data.operations.optValueToNull(req.body.MotivoDichiarato)
    )
      .then ((result) => { res.status(200).json(https.httpResponse.formValidHttpResponse(result)); })
      .catch((result) => { res.status(500).json(https.httpResponse.formValidHttpResponse(result)); })
  }
});


/** -----------------------------------------------------------------------------------------------
 * @api {post} /service/stop Richiesta Disiscrizione
 * @apiName POST.CeaseService
 * @apiGroup Service
 * @apiParam {String} IdTessera Id tessera del cliente
 * @apiParam {String} [MotivoDichiarato] Motivo fornito dal cliente per la cessazione del servizio (testo libero)
 * @apiParamExample {json} Request-Example:
 *    "IdTessera": "<REDACTED>-0001",
 *    "MotivoDichiarato": "Trasferimento di residenza"
 * @apiHeader (Authorization) {String} Authorization Identity-Token del service account fornito (Oct.2020: Dismissed)
 * @apiHeaderExample {json} Header-Example:
 *    "Authorization": "Bearer eyJhbGciOi...FpD3UyQ"
 * @apiSuccess {Number} status Codice di successo
 * @apiSuccess {String} description Descrizione del codice di successo
 * @apiSuccess {String} data Dati chiave del record appena inserito
 * @apiSuccess {String=null} error Elenco errori riscontrati
 * @apiSuccessExample {json} Success-Response:
 *    "status": 200,
 *    "description": "Request processed with success",
 *    "data": [
 *      {
 *       "_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
 *        "IdTessera": "<REDACTED>-0001"
 *      }
 *    ],
 *    "error": null
 * @apiError (Error 4xx, Error 6xx) {Number} status Codice di errore
 * @apiError (Error 4xx, Error 6xx) {String} description Descrizione del codice di errore
 * @apiError (Error 4xx, Error 6xx) {String} data Dati chiave del record appena inserito
 * @apiError (Error 4xx, Error 6xx) {String} error Elenco errori riscontrati
 * @apiErrorExample {json} Error-Response:
 *    "status": 400,
 *    "description": "Bad Request",
 *    "data": null,
 *    "error": "\"IdTessera\" is required"
 * @apiErrorExample {json} Error-Response:
 *    "status": 601,
 *    "description": "La tessera non è censita a sistema",
 *    "data": [
 *      {
 *        "_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
 *        "IdTessera": "<REDACTED>-0001"
 *      }
 *    ],
 *    "error": null
 */
app.post(`${root}/service/stop/`, async(req, res) => {
  const reqTimestamp = new Date();
  if(LOG_LEVEL<2) console.info(`Received request at ${root}/service/stop/`);
  const {error, value} = https.ceaseService.schema.validate(req.body);
  if(error) {
    if(LOG_LEVEL<2) console.error(`Validation failed with error ${error.details[0].message}`);
    res.status(400).json(https.httpResponse.formErrorHttpResponse(error));
  } else {
    ctrl.ceaseService(
      reqTimestamp,
      req.body.IdTessera,
      data.operations.optValueToNull(req.body.MotivoDichiarato)
    )
      .then ((result) => { res.status(200).json(https.httpResponse.formValidHttpResponse(result)); })
      .catch((result) => { res.status(500).json(https.httpResponse.formValidHttpResponse(result)); })
  }
});


/** -----------------------------------------------------------------------------------------------
 * @api {put} /order/removeItem Rimozione Articolo
 * @apiName PUT.RemoveItem
 * @apiGroup Order
 * @apiParam {String} IdTessera Id tessera del cliente
 * @apiParam {String} IdOrdine Id univoco dell'ordine da cui rimuovere il prodotto
 * @apiParam {String} IdProdottoWeb Codice del prodotto rimosso
 * @apiParam {String="MOT-XXX"} [IdMotivazione] Codice del motivo fornito dal cliente per la rimozione dell'oggetto dal carello
 * @apiParamExample {json} Request-Example:
 *    "IdTessera": "<REDACTED>-0001",
 *    "IdOrdine": "ORDINE-0001",
 *    "IdProdottoWeb": "PRODOTTO-0001",
 *    "IdMotivazione": "MOT-001"
 * @apiHeader (Authorization) {String} Authorization Identity-Token del service account fornito (Oct.2020: Dismissed)
 * @apiHeaderExample {json} Header-Example:
 *    "Authorization": "Bearer eyJhbGciOi...FpD3UyQ"
 * @apiSuccess {Number} status Codice di successo
 * @apiSuccess {String} description Descrizione del codice di successo
 * @apiSuccess {String} data Dati chiave del record appena inserito
 * @apiSuccess {String=null} error Elenco errori riscontrati
 * @apiSuccessExample {json} Success-Response:
 *    "status": 200,
 *    "description": "Request processed with success",
 *    "data": [
 *      {
 *        "_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
 *        "IdTessera": "<REDACTED>-0001"
 *      }
 *    ],
 *    "error": null
 * @apiError (Error 4xx) {Number} status Codice di errore
 * @apiError (Error 4xx) {String} description Descrizione del codice di errore
 * @apiError (Error 4xx) {String} data Dati chiave del record appena inserito
 * @apiError (Error 4xx) {String} error Elenco errori riscontrati
 * @apiErrorExample {json} Error-Response:
 *    "status": 400,
 *    "description": "Bad Request",
 *    "data": null,
 *    "error": {
 *      "reason": "invalidRequest",
 *      "location": "jsonInputBody",
 *      "message": "\"IdMotivazione\" is required"
 *    }
 */
app.put(`${root}/order/removeItem/`, async(req, res) => {
  const reqTimestamp = new Date();
  if(LOG_LEVEL<2) console.info(`Received request at ${root}/order/removeItem/`);
  const {error, value} = https.removeItem.schema.validate(req.body);
  if(error) {
    if(LOG_LEVEL<2) console.error(`Validation failed with error ${error.details[0].message}`);
    res.status(400).json(https.httpResponse.formErrorHttpResponse(error));
  } else {
    ctrl.removeItem (
      reqTimestamp,
      req.body.IdTessera,
      req.body.IdOrdine,
      req.body.IdProdottoWeb,
      data.operations.optValueToNull(req.body.IdMotivazione)
    )
      .then ((result) => { res.status(200).json(https.httpResponse.formValidHttpResponse(result)); })
      .catch((result) => { res.status(500).json(https.httpResponse.formValidHttpResponse(result)); })
  }
});


/** -----------------------------------------------------------------------------------------------
 * @api {delete} /order/cancel Cancellazione Ordine
 * @apiName DELETE.CancelOrder
 * @apiGroup Order
 * @apiParam {String} IdTessera Id tessera del cliente
 * @apiParam {String} IdOrdine Id univoco dell'ordine da cancellare
 * @apiParam {String="MOT-XXX"} [IdMotivazione] Codice del motivo fornito dal cliente per la cancellazione dell'ordine
 * @apiParamExample {json} Request-Example:
 *    "IdTessera": "<REDACTED>-0001",
 *    "IdOrdine": "ORDINE-0001"
 * @apiHeader (Authorization) {String} Authorization Identity-Token del service account fornito (Oct.2020: Dismissed)
 * @apiHeaderExample {json} Header-Example:
 *    "Authorization": "Bearer eyJhbGciOi...FpD3UyQ"
 * @apiSuccess {Number} status Codice di successo
 * @apiSuccess {String} description Descrizione del codice di successo
 * @apiSuccess {String} data Dati chiave del record appena inserito
 * @apiSuccess {String=null} error Elenco errori riscontrati
 * @apiSuccessExample {json} Success-Response:
 *    "status": 200,
 *    "description": "Request processed with success",
 *    "data": [
 *      {
 *        "_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
 *        "IdTessera": "<REDACTED>-0001"
 *      }
 *    ],
 *    "error": null
 * @apiError (Error 4xx) {Number} status Codice di errore
 * @apiError (Error 4xx) {String} description Descrizione del codice di errore
 * @apiError (Error 4xx) {String} data Dati chiave del record appena inserito
 * @apiError (Error 4xx) {String} error Elenco errori riscontrati
 * @apiErrorExample {json} Error-Response:
 *    "status": 400,
 *    "description": "Bad Request",
 *    "data": null,
 *    "error": {
 *      "reason": "invalidRequest",
 *      "location": "jsonInputBody",
 *      "message": "\"IdOrdine\" is required"
 *    }
 */
app.delete(`${root}/order/cancel/`, async(req, res) => {
  const reqTimestamp = new Date();
  if(LOG_LEVEL<2) console.info(`Received request at ${root}/order/cancel/`);
  const {error, value} = https.cancelOrder.schema.validate(req.body);
  if(error) {
    if(LOG_LEVEL<2) console.error(`Validation failed with error ${error.details[0].message}`);
    res.status(400).json(https.httpResponse.formErrorHttpResponse(error));
  } else {
    ctrl.cancelOrder (
      reqTimestamp,
      req.body.IdTessera,
      req.body.IdOrdine,
      data.operations.optValueToNull(req.body.IdMotivazione)
    )
      .then ((result) => { res.status(200).json(https.httpResponse.formValidHttpResponse(result)); })
      .catch((result) => { res.status(500).json(https.httpResponse.formValidHttpResponse(result)); })
  }
});


/** -----------------------------------------------------------------------------------------------
 * @api {post} /order/planningCalendar Visualiz. Pianificazione
 * @apiName POST.PlanningCalendar
 * @apiGroup Order
 * @apiParam {String} IdTessera Id tessera del cliente
 * @apiParam {String} [DataInizioPianificazione=1900-01-01] Data minima da cui restituire la pianificazione dei box
 * @apiParamExample {json} Request-Example:
 *    "IdTessera": "<REDACTED>-0001",
 *    "DataInizioPianificazione": "2020-08-01"
 * @apiHeader (Authorization) {String} Authorization Identity-Token del service account fornito (Oct.2020: Dismissed)
 * @apiHeaderExample {json} Header-Example:
 *    "Authorization": "Bearer eyJhbGciOi...FpD3UyQ"
 * @apiSuccess {Number} status Codice di successo
 * @apiSuccess {String} description Descrizione del codice di successo
 * @apiSuccess {String} data Dati chiave del record appena inserito e la pianificazione richiesta
 * @apiSuccess {String=null} error Elenco errori riscontrati
 * @apiSuccessExample {json} Success-Response:
 *    "status": 200,
 *    "description": "Request processed with success",
 *    "data": [
 *      {
 *        "_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
 *        "IdTessera": "<REDACTED>-0001"
 *        "IdProfiloWeb": "WEB-0001",
 *        "Pianificazione": [
 *          {
 *            "IdOrdine": "ORDINE-0001",
 *            "DataConsegnaPrevista": "2020-09-30",
 *            "GiornoConsegnaPrevisto": "Mercoledì",
 *            "IdTimeslot": "145",
 *            "FasciaOraria": "16:00-18:00",
 *            "StatoOrdine": "Ordinato"
 *          },
 *          {
 *            "IdOrdine": "TBD",
 *            "DataConsegnaPrevista": "2020-08-19",
 *            "GiornoConsegnaPrevisto": "Mercoledì",
 *            "IdTimeslot": "TBD",
 *            "FasciaOraria": "TBD",
 *            "StatoOrdine": "Non previsto (servizio sospeso)"
 *          },
 *          ...,
 *          ...,
 *          {
 *            "IdOrdine": "TBD",
 *            "DataConsegnaPrevista": "2020-11-25",
 *            "GiornoConsegnaPrevisto": "Mercoledì",
 *            "IdTimeslot": "TBD",
 *            "FasciaOraria": "TBD",
 *            "StatoOrdine": "Pianificato"
 *          }
 *        ]
 *      }
 *    ],
 *    "error": null
 * @apiError (Error 4xx, Error 6xx) {Number} status Codice di errore
 * @apiError (Error 4xx, Error 6xx) {String} description Descrizione del codice di errore
 * @apiError (Error 4xx, Error 6xx) {String} data Dati chiave del record appena inserito
 * @apiError (Error 4xx, Error 6xx) {String} error Elenco errori riscontrati
 * @apiErrorExample {json} Error-Response:
 *    "status": 400,
 *    "description": "Bad Request",
 *    "data": null,
 *    "error": {
 *      "reason": "invalidRequest",
 *      "location": "jsonInputBody",
 *      "message": "\"IdTessera\" is required"
 *    }
 * @apiErrorExample {json} Error-Response:
 *    "status": 601,
 *    "description": "La tessera non è censita a sistema",
 *    "data": [
 *      {
 *        "_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
 *        "IdTessera": "<REDACTED>-0001"
 *      }
 *    ],
 *    "error": null
 */
app.post(`${root}/order/planningCalendar/`, async(req, res) => {
  const reqTimestamp = new Date();
  if(LOG_LEVEL<2) console.info(`Received request at ${root}/order/planningCalendar/`);
  const {error, value} = https.planningCalendar.schema.validate(req.body);
  if(error) {
    if(LOG_LEVEL<2) console.error(`Validation failed with error ${error.details[0].message}`);
    res.status(400).json(https.httpResponse.formErrorHttpResponse(error));
  } else {
    ctrl.planningCalendar (
      reqTimestamp,
      req.body.IdTessera,
      data.operations.optValueToNull(req.body.DataInizioPianificazione)
    )
      .then ((result) => { res.status(200).json(https.httpResponse.formValidHttpResponse(result)); })
      .catch((result) => { res.status(500).json(https.httpResponse.formValidHttpResponse(result)); })
  }
});


/** -----------------------------------------------------------------------------------------------
 * @api {post} /user/eligibility Verifica Idoneità
 * @apiName POST.UserEligibility
 * @apiGroup User
 * @apiParam {String} IdTessera Id tessera del cliente
 * @apiParamExample {json} Request-Example:
 *    "IdTessera": "<REDACTED>-0001"
 * @apiHeader (Authorization) {String} Authorization Identity-Token del service account fornito (Oct.2020: Dismissed)
 * @apiHeaderExample {json} Header-Example:
 *    "Authorization": "Bearer eyJhbGciOi...FpD3UyQ"
 * @apiSuccess {Number} status Codice di successo
 * @apiSuccess {String} description Descrizione del codice di successo
 * @apiSuccess {String} data Dati chiave del record appena inserito e risposta sull'idoneità
 * @apiSuccess {String=null} error Elenco errori riscontrati
 * @apiSuccessExample {json} Success-Response:
 *    "status": 200,
 *    "description": "Request processed with success",
 *    "data": [
 *      {
 *        "_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
 *        "IdTessera": "<REDACTED>-0001",
 *        "IdoneitaServizio": false,
 *        "BudgetSettimanaleConsigliato": 50
 *      }
 *    ],
 *    "error": null
 * @apiError (Error 4xx, Error 6xx) {Number} status Codice di errore
 * @apiError (Error 4xx, Error 6xx) {String} description Descrizione del codice di errore
 * @apiError (Error 4xx, Error 6xx) {String} data Dati chiave del record appena inserito
 * @apiError (Error 4xx, Error 6xx) {String} error Elenco errori riscontrati
 * @apiErrorExample {json} Error-Response:
 *    "status": 400,
 *    "description": "Bad Request",
 *    "data": null,
 *    "error": {
 *      "reason": "invalidRequest",
 *      "location": "jsonInputBody",
 *      "message": "\"IdTessera\" is required"
 *    }
 * @apiErrorExample {json} Error-Response:
 *    "status": 601,
 *    "description": "La tessera non è censita a sistema",
 *    "data": [
 *      {
 *        "_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
 *        "IdTessera": "<REDACTED>-0001",
 *        "IdoneitaServizio": null,
 *        "BudgetSettimanaleConsigliato": null
 *      }
 *    ],
 *    "error": null
 */
app.post(`${root}/user/eligibility/`, async(req, res) => {
  const reqTimestamp = new Date();
  if(LOG_LEVEL<2) console.info(`Received request at ${root}/user/eligibility/`);
  const {error, value} = https.userEligibility.schema.validate(req.body);
  if(error) {
    if(LOG_LEVEL<2) console.error(`Validation failed with error ${error.details[0].message}`);
    res.status(400).json(https.httpResponse.formErrorHttpResponse(error));
  } else {
    ctrl.userEligibility (
      reqTimestamp,
      req.body.IdTessera
    )
      .then ((result) => { res.status(200).json(https.httpResponse.formValidHttpResponse(result)); })
      .catch((result) => { res.status(500).json(https.httpResponse.formValidHttpResponse(result)); })
  }
});


/** -----------------------------------------------------------------------------------------------
 * @api {post} /user/survey Caricamento Questionario
 * @apiName GET.UserSurvey
 * @apiGroup User
 * @apiParam {String} IdTessera Id tessera del cliente
 * @apiParam {String} IdQuestionario Id che indica il tipo di questionario
 * @apiParam {String} Questionario[Domanda] Domanda per esteso o id della domanda
 * @apiParam {String} Questionario[Risposta] Risposta dell'utente. Risposte multiple devono essere concatenate da ";"
 * @apiParamExample {json} Request-Example:
 *    "IdTessera": "<REDACTED>-0001",
 *    "IdQuestionario": "Q001",
 *    "Questionario": [
 *      {
 *        "Domanda": "Elenca le tue intolleranze",
 *        "Risposta": "Lattosio;..."
 *      },
 *      {
 *        "Domanda": "Sei vegetariano?",
 *        "Risposta": "No"
 *      }
 *    ]
 * @apiHeader (Authorization) {String} Authorization Identity-Token del service account fornito (Oct.2020: Dismissed)
 * @apiHeaderExample {json} Header-Example:
 *    "Authorization": "Bearer eyJhbGciOi...FpD3UyQ"
 * @apiSuccess {Number} status Codice di successo
 * @apiSuccess {String} description Descrizione del codice di successo
 * @apiSuccess {String} data Dati chiave del record appena inserito
 * @apiSuccess {String=null} error Elenco errori riscontrati
 * @apiSuccessExample {json} Success-Response:
 *    "status": 200,
 *    "description": "Request processed with success",
 *    "data": [
 *      {
 *        "_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
 *        "IdTessera": "<REDACTED>-0001"
 *      }
 *    ],
 *    "error": null
 * @apiError (Error 4xx) {Number} status Codice di errore
 * @apiError (Error 4xx) {String} description Descrizione del codice di errore
 * @apiError (Error 4xx) {String} data Dati chiave del record appena inserito
 * @apiError (Error 4xx) {String} error Elenco errori riscontrati
 * @apiErrorExample {json} Error-Response:
 *    "status": 400,
 *    "description": "Bad Request",
 *    "data": null,
 *    "error": {
 *      "reason": "invalidRequest",
 *      "location": "jsonInputBody",
 *      "message": "\"IdQuestionario\" is required"
 *    }
 */
app.post(`${root}/user/survey/`, async(req, res) => {
  const reqTimestamp = new Date();
  if(LOG_LEVEL<2) console.info(`Received request at ${root}/user/survey/`);
  const {error, value} = https.userSurvey.schema.validate(req.body);
  if(error) {
    if(LOG_LEVEL<2) console.error(`Validation failed with error ${error.details[0].message}`);
    res.status(400).json(https.httpResponse.formErrorHttpResponse(error));
  } else {
    ctrl.userSurvey (
      reqTimestamp,
      req.body.IdTessera,
      req.body.IdQuestionario,
      req.body.Questionario
    )
      .then ((result) => { res.status(200).json(https.httpResponse.formValidHttpResponse(result)); })
      .catch((result) => { res.status(500).json(https.httpResponse.formValidHttpResponse(result)); })
  }
});



module.exports = app;