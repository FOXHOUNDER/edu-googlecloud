define({ "api": [
  {
    "type": "delete",
    "url": "/order/cancel",
    "title": "Cancellazione Ordine",
    "name": "DELETE.CancelOrder",
    "group": "Order",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdTessera",
            "description": "<p>Id tessera del cliente</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdOrdine",
            "description": "<p>Id univoco dell'ordine da cancellare</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"MOT-XXX\""
            ],
            "optional": true,
            "field": "IdMotivazione",
            "description": "<p>Codice del motivo fornito dal cliente per la cancellazione dell'ordine</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\"IdTessera\": \"<REDACTED>-0001\",\n\"IdOrdine\": \"ORDINE-0001\"",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Identity-Token del service account fornito (Oct.2020: Dismissed)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "\"Authorization\": \"Bearer eyJhbGciOi...FpD3UyQ\"",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "allowedValues": [
              "null"
            ],
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\"status\": 200,\n\"description\": \"Request processed with success\",\n\"data\": [\n  {\n    \"_id\": \"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\",\n    \"IdTessera\": \"<REDACTED>-0001\"\n  }\n],\n\"error\": null",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di errore</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di errore</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\"status\": 400,\n\"description\": \"Bad Request\",\n\"data\": null,\n\"error\": {\n  \"reason\": \"invalidRequest\",\n  \"location\": \"jsonInputBody\",\n  \"message\": \"\\\"IdOrdine\\\" is required\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Order"
  },
  {
    "type": "post",
    "url": "/order/planningCalendar",
    "title": "Visualiz. Pianificazione",
    "name": "POST.PlanningCalendar",
    "group": "Order",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdTessera",
            "description": "<p>Id tessera del cliente</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "DataInizioPianificazione",
            "defaultValue": "1900-01-01",
            "description": "<p>Data minima da cui restituire la pianificazione dei box</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\"IdTessera\": \"<REDACTED>-0001\",\n\"DataInizioPianificazione\": \"2020-08-01\"",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Identity-Token del service account fornito (Oct.2020: Dismissed)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "\"Authorization\": \"Bearer eyJhbGciOi...FpD3UyQ\"",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito e la pianificazione richiesta</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "allowedValues": [
              "null"
            ],
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\"status\": 200,\n\"description\": \"Request processed with success\",\n\"data\": [\n  {\n    \"_id\": \"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\",\n    \"IdTessera\": \"<REDACTED>-0001\"\n    \"IdProfiloWeb\": \"WEB-0001\",\n    \"Pianificazione\": [\n      {\n        \"IdOrdine\": \"ORDINE-0001\",\n        \"DataConsegnaPrevista\": \"2020-09-30\",\n        \"GiornoConsegnaPrevisto\": \"Mercoledì\",\n        \"IdTimeslot\": \"145\",\n        \"FasciaOraria\": \"16:00-18:00\",\n        \"StatoOrdine\": \"Ordinato\"\n      },\n      {\n        \"IdOrdine\": \"TBD\",\n        \"DataConsegnaPrevista\": \"2020-08-19\",\n        \"GiornoConsegnaPrevisto\": \"Mercoledì\",\n        \"IdTimeslot\": \"TBD\",\n        \"FasciaOraria\": \"TBD\",\n        \"StatoOrdine\": \"Non previsto (servizio sospeso)\"\n      },\n      ...,\n      ...,\n      {\n        \"IdOrdine\": \"TBD\",\n        \"DataConsegnaPrevista\": \"2020-11-25\",\n        \"GiornoConsegnaPrevisto\": \"Mercoledì\",\n        \"IdTimeslot\": \"TBD\",\n        \"FasciaOraria\": \"TBD\",\n        \"StatoOrdine\": \"Pianificato\"\n      }\n    ]\n  }\n],\n\"error\": null",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx, Error 6xx": [
          {
            "group": "Error 4xx, Error 6xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di errore</p>"
          },
          {
            "group": "Error 4xx, Error 6xx",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di errore</p>"
          },
          {
            "group": "Error 4xx, Error 6xx",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito</p>"
          },
          {
            "group": "Error 4xx, Error 6xx",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\"status\": 400,\n\"description\": \"Bad Request\",\n\"data\": null,\n\"error\": {\n  \"reason\": \"invalidRequest\",\n  \"location\": \"jsonInputBody\",\n  \"message\": \"\\\"IdTessera\\\" is required\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "\"status\": 601,\n\"description\": \"La tessera non è censita a sistema\",\n\"data\": [\n  {\n    \"_id\": \"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\",\n    \"IdTessera\": \"<REDACTED>-0001\"\n  }\n],\n\"error\": null",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Order"
  },
  {
    "type": "put",
    "url": "/order/removeItem",
    "title": "Rimozione Articolo",
    "name": "PUT.RemoveItem",
    "group": "Order",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdTessera",
            "description": "<p>Id tessera del cliente</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdOrdine",
            "description": "<p>Id univoco dell'ordine da cui rimuovere il prodotto</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdProdottoWeb",
            "description": "<p>Codice del prodotto rimosso</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"MOT-XXX\""
            ],
            "optional": true,
            "field": "IdMotivazione",
            "description": "<p>Codice del motivo fornito dal cliente per la rimozione dell'oggetto dal carello</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\"IdTessera\": \"<REDACTED>-0001\",\n\"IdOrdine\": \"ORDINE-0001\",\n\"IdProdottoWeb\": \"PRODOTTO-0001\",\n\"IdMotivazione\": \"MOT-001\"",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Identity-Token del service account fornito (Oct.2020: Dismissed)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "\"Authorization\": \"Bearer eyJhbGciOi...FpD3UyQ\"",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "allowedValues": [
              "null"
            ],
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\"status\": 200,\n\"description\": \"Request processed with success\",\n\"data\": [\n  {\n    \"_id\": \"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\",\n    \"IdTessera\": \"<REDACTED>-0001\"\n  }\n],\n\"error\": null",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di errore</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di errore</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\"status\": 400,\n\"description\": \"Bad Request\",\n\"data\": null,\n\"error\": {\n  \"reason\": \"invalidRequest\",\n  \"location\": \"jsonInputBody\",\n  \"message\": \"\\\"IdMotivazione\\\" is required\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Order"
  },
  {
    "type": "post",
    "url": "/service/stop",
    "title": "Richiesta Disiscrizione",
    "name": "POST.CeaseService",
    "group": "Service",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdTessera",
            "description": "<p>Id tessera del cliente</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "MotivoDichiarato",
            "description": "<p>Motivo fornito dal cliente per la cessazione del servizio (testo libero)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\"IdTessera\": \"<REDACTED>-0001\",\n\"MotivoDichiarato\": \"Trasferimento di residenza\"",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Identity-Token del service account fornito (Oct.2020: Dismissed)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "\"Authorization\": \"Bearer eyJhbGciOi...FpD3UyQ\"",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "allowedValues": [
              "null"
            ],
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\"status\": 200,\n\"description\": \"Request processed with success\",\n\"data\": [\n  {\n   \"_id\": \"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\",\n    \"IdTessera\": \"<REDACTED>-0001\"\n  }\n],\n\"error\": null",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx, Error 6xx": [
          {
            "group": "Error 4xx, Error 6xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di errore</p>"
          },
          {
            "group": "Error 4xx, Error 6xx",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di errore</p>"
          },
          {
            "group": "Error 4xx, Error 6xx",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito</p>"
          },
          {
            "group": "Error 4xx, Error 6xx",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\"status\": 400,\n\"description\": \"Bad Request\",\n\"data\": null,\n\"error\": \"\\\"IdTessera\\\" is required\"",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "\"status\": 601,\n\"description\": \"La tessera non è censita a sistema\",\n\"data\": [\n  {\n    \"_id\": \"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\",\n    \"IdTessera\": \"<REDACTED>-0001\"\n  }\n],\n\"error\": null",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Service"
  },
  {
    "type": "post",
    "url": "/service/pause",
    "title": "Richiesta Sospensione",
    "name": "POST.PauseService",
    "group": "Service",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdTessera",
            "description": "<p>Id tessera del cliente</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "DataInizioSospensione",
            "description": "<p>Data di inizio della sospensione del servizio</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "DataFineSospensione",
            "description": "<p>Data di fine della sospensione del servizio</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "MotivoDichiarato",
            "description": "<p>Motivo fornito dal cliente per la sospensione del servizio (testo libero)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\"IdTessera\": \"<REDACTED>-0001\",\n\"DataInizioSospensione\": \"2020-08-01\",\n\"DataFineSospensione\": \"2020-09-01\",\n\"MotivoDichiarato\": \"Ferie\"",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Identity-Token del service account fornito (Oct.2020: Dismissed)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "\"Authorization\": \"Bearer eyJhbGciOi...FpD3UyQ\"",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "allowedValues": [
              "null"
            ],
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\"status\": 200,\n\"description\": \"Request processed with success\",\n\"data\": [\n  {\n    \"_id\": \"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\",\n    \"IdTessera\": \"<REDACTED>-0001\"\n  }\n],\n\"error\": null",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx, Error 6xx": [
          {
            "group": "Error 4xx, Error 6xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di errore</p>"
          },
          {
            "group": "Error 4xx, Error 6xx",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di errore</p>"
          },
          {
            "group": "Error 4xx, Error 6xx",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito</p>"
          },
          {
            "group": "Error 4xx, Error 6xx",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\"status\": 400,\n\"description\": \"Bad Request\",\n\"data\": null,\n\"error\": {\n  \"reason\": \"invalidRequest\",\n  \"location\": \"jsonInputBody\",\n  \"message\": \"\\\"DataFineSospensione\\\" must be greater than or equal to \\\"DataInizioSospensione\\\"\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "\"status\": 601,\n\"description\": \"La tessera non è censita a sistema\",\n\"data\": [\n  {\n    \"_id\": \"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\",\n    \"IdTessera\": \"<REDACTED>-0001\"\n  }\n],\n\"error\": null",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Service"
  },
  {
    "type": "post",
    "url": "/service/join",
    "title": "Richiesta Adesione",
    "name": "POST.joinService",
    "group": "Service",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdTessera",
            "description": "<p>Id tessera del cliente</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdProfiloWeb",
            "description": "<p>Id profilo web del portale <REDACTED></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdIndirizzoWeb",
            "description": "<p>Id indirizzo web (di consegna) del portale <REDACTED></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"Lun\"",
              "\"Mar\"",
              "\"Mer\"",
              "\"Gio\"",
              "\"Ven\"",
              "\"Sab\"",
              "\"Dom\""
            ],
            "optional": false,
            "field": "PreferenzaGiorno",
            "description": "<p>Preferenza sul giorno di consegna del box</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"142\"",
              "\"143\"",
              "\"144\"",
              "\"145\"",
              "\"146\"",
              "\"147\""
            ],
            "optional": false,
            "field": "PreferenzaFasciaOraria",
            "description": "<p>Preferenza sulla fascia oraria di consegna del box (IdTimeslot)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "BudgetSettimanale",
            "description": "<p>Budget settimanale di spesa indicato per la generazione del box</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "FlagsPrivacy[Key]",
            "description": "<p>Nome identificativo del flag (e.g. Consenso al Trattamento ..)</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "FlagsPrivacy[Value]",
            "description": "<p>Valore true/false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\"IdTessera\": \"<REDACTED>-0001\",\n\"IdProfiloWeb\": \"<REDACTED>-WEB-0001\",\n\"IdIndirizzoWeb\": \"123\",\n\"PreferenzaGiorno\": \"Lun\",\n\"PreferenzaFasciaOraria\": \"145\",\n\"BudgetSettimanale\": 50,\n\"FlagsPrivacy\": [\n  {\n    \"Key\": \"Adesione al servizio <REDACTED>\",\n    \"Value\": true\n  }\n]",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Identity-Token del service account fornito (Oct.2020: Dismissed)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "\"Authorization\": \"Bearer eyJhbGciOi...FpD3UyQ\"",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "allowedValues": [
              "null"
            ],
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\"status\": 200,\n\"description\": \"Request processed with success\",\n\"data\": [\n  {\n    \"_id\": \"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\",\n    \"IdTessera\": \"<REDACTED>-0001\"\n  }\n],\n\"error\": null",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx, Error 6xx": [
          {
            "group": "Error 4xx, Error 6xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di errore</p>"
          },
          {
            "group": "Error 4xx, Error 6xx",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di errore</p>"
          },
          {
            "group": "Error 4xx, Error 6xx",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito</p>"
          },
          {
            "group": "Error 4xx, Error 6xx",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\"status\": 400,\n\"description\": \"Bad Request\",\n\"data\": null,\n\"error\": {\n  \"reason\": \"invalidRequest\",\n  \"location\": \"jsonInputBody\",\n  \"message\": \"\\\"BudgetSettimanale\\\" must be an integer\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "\"status\": 601,\n\"description\": \"La tessera non è censita a sistema\",\n\"data\": [\n  {\n    \"_id\": \"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\",\n    \"IdTessera\": \"<REDACTED>-0001\"\n  }\n],\n\"error\": null",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Service"
  },
  {
    "type": "post",
    "url": "/user/survey",
    "title": "Caricamento Questionario",
    "name": "GET.UserSurvey",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdTessera",
            "description": "<p>Id tessera del cliente</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdQuestionario",
            "description": "<p>Id che indica il tipo di questionario</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "Questionario[Domanda]",
            "description": "<p>Domanda per esteso o id della domanda</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "Questionario[Risposta]",
            "description": "<p>Risposta dell'utente. Risposte multiple devono essere concatenate da &quot;;&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\"IdTessera\": \"<REDACTED>-0001\",\n\"IdQuestionario\": \"Q001\",\n\"Questionario\": [\n  {\n    \"Domanda\": \"Elenca le tue intolleranze\",\n    \"Risposta\": \"Lattosio;...\"\n  },\n  {\n    \"Domanda\": \"Sei vegetariano?\",\n    \"Risposta\": \"No\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Identity-Token del service account fornito (Oct.2020: Dismissed)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "\"Authorization\": \"Bearer eyJhbGciOi...FpD3UyQ\"",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "allowedValues": [
              "null"
            ],
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\"status\": 200,\n\"description\": \"Request processed with success\",\n\"data\": [\n  {\n    \"_id\": \"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\",\n    \"IdTessera\": \"<REDACTED>-0001\"\n  }\n],\n\"error\": null",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di errore</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di errore</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\"status\": 400,\n\"description\": \"Bad Request\",\n\"data\": null,\n\"error\": {\n  \"reason\": \"invalidRequest\",\n  \"location\": \"jsonInputBody\",\n  \"message\": \"\\\"IdQuestionario\\\" is required\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/eligibility",
    "title": "Verifica Idoneità",
    "name": "POST.UserEligibility",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "IdTessera",
            "description": "<p>Id tessera del cliente</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\"IdTessera\": \"<REDACTED>-0001\"",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Identity-Token del service account fornito (Oct.2020: Dismissed)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "\"Authorization\": \"Bearer eyJhbGciOi...FpD3UyQ\"",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di successo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito e risposta sull'idoneità</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "allowedValues": [
              "null"
            ],
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\"status\": 200,\n\"description\": \"Request processed with success\",\n\"data\": [\n  {\n    \"_id\": \"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\",\n    \"IdTessera\": \"<REDACTED>-0001\",\n    \"IdoneitaServizio\": false,\n    \"BudgetSettimanaleConsigliato\": 50\n  }\n],\n\"error\": null",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx, Error 6xx": [
          {
            "group": "Error 4xx, Error 6xx",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>Codice di errore</p>"
          },
          {
            "group": "Error 4xx, Error 6xx",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Descrizione del codice di errore</p>"
          },
          {
            "group": "Error 4xx, Error 6xx",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>Dati chiave del record appena inserito</p>"
          },
          {
            "group": "Error 4xx, Error 6xx",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>Elenco errori riscontrati</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\"status\": 400,\n\"description\": \"Bad Request\",\n\"data\": null,\n\"error\": {\n  \"reason\": \"invalidRequest\",\n  \"location\": \"jsonInputBody\",\n  \"message\": \"\\\"IdTessera\\\" is required\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "\"status\": 601,\n\"description\": \"La tessera non è censita a sistema\",\n\"data\": [\n  {\n    \"_id\": \"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\",\n    \"IdTessera\": \"<REDACTED>-0001\",\n    \"IdoneitaServizio\": null,\n    \"BudgetSettimanaleConsigliato\": null\n  }\n],\n\"error\": null",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "User"
  }
] });
