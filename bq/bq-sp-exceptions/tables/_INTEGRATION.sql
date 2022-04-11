-- DROP TABLE `<REDACTED>.LVXX_TESTENV._INTEGRATION`;

CREATE OR REPLACE TABLE
  `<REDACTED>.LVXX_TESTENV._INTEGRATION` (
    DATE      TIMESTAMP NOT NULL OPTIONS (description=`Data del log`),
    ROOT_PID  STRING    NOT NULL OPTIONS (description=`Root PID del job Talend di caricamento. Default: _M<YMD>`),
    STEP      STRING    NOT NULL OPTIONS (description=`Step (e.g. procedura) che ha generato il log`),
    ERR_LEVEL STRING    NOT NULL OPTIONS (description=`Livello di errore`),
    LOG       STRING    NOT NULL OPTIONS (description=`Messaggio di log`)
  )
CLUSTER BY
  DATE
OPTIONS (
  description=`Log dei processi di integrazione`,
  labels=[("state", "production"), ("input", "delta")]
);