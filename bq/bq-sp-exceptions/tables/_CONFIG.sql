-- DROP TABLE `<REDACTED>.LVXX_TESTENV._CONFIG`;

CREATE OR REPLACE TABLE
  `<REDACTED>.LVXX_TESTENV._CONFIG` (
    KEY         STRING NOT NULL OPTIONS (description=`Parametro di configurazione`),
    VALUE       STRING NOT NULL OPTIONS (description=`Valore del parametro di configurazione`),
    DESCRIPTION STRING NOT NULL OPTIONS (description=`Descrizione/dominio del parametro di configurazione`),
  )
OPTIONS (
  description=`Tabella di configurazione per il processing`,
  labels=[("state", "production"), ("input", "delta")]
);

INSERT INTO `LVXX_TESTENV._CONFIG` 
VALUES ('LOG_LEVEL', 'TRACE', 'Domain: TRACE, DEBUG, INFO, WARN, ERROR')