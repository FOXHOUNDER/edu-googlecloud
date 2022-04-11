CREATE OR REPLACE PROCEDURE `<REDACTED>.LVXX_TESTENV.uspDividePositiveNumbers`(IN num INT64, IN div INT64, OUT result FLOAT64, OUT error STRING)
BEGIN
-- =============================================
-- Description:	Returns num/div. If num<0 or div=0, returns ERR -1. 
-- Changelog:   27.03.2022 [00] (AP) Creation!
-- Notes:       [01] Reference: https://cloud.google.com/bigquery/docs/reference/standard-sql/scripting#beginexceptionend
-- To-do:       [--] /
-- =============================================
  DECLARE STEP STRING DEFAULT 'LVXX_TESTENV.uspDividePositiveNumbers';
  DECLARE rootPid STRING DEFAULT NULL;
  SET result = NULL;
  SET error = NULL;

  BEGIN
    IF (num<0) THEN
      RAISE USING MESSAGE = 'I really don\'t like to divide negative numbers...';
    END IF;
    
    BEGIN
      SET result = num/div;
      CALL `LVXX_TESTENV.sp_Logger`(rootPid, STEP, 'DEBUG', CONCAT(num, ' divided by ', div, ' is: ', result));
    END;
  
    RETURN;
  
    EXCEPTION WHEN ERROR THEN
      SET result = -1;
      SET error = @@error.message;
      CALL `LVXX_TESTENV.sp_Logger`(rootPid, STEP, 'ERROR', error);
  END;
END;