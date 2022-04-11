CREATE OR REPLACE PROCEDURE `<REDACTED>.LVXX_TESTENV.sp_Logger`(IN rootPid STRING, IN step STRING, IN errLevel STRING, IN message STRING)
BEGIN
-- =============================================
-- Description:	Procedura di log
-- Changelog:   08.10.2020 [00] (AP) v1.0
-- Notes/Bugs:  [--] /
-- To-do:       [--] /
-- =============================================
  DECLARE LOG_LEVEL, ERR_LEVEL INT64;
  
  SET LOG_LEVEL = CASE (SELECT VALUE FROM `LVXX_TESTENV._CONFIG` WHERE KEY = 'LOG_LEVEL')
                    WHEN 'TRACE'  THEN 0
                    WHEN 'DEBUG'  THEN 1
                    WHEN 'INFO'   THEN 2
                    WHEN 'WARN'   THEN 3
                    WHEN 'ERROR'  THEN 4
                    ELSE -1
                  END;
  SET ERR_LEVEL = CASE COALESCE(errLevel, 'INFO')
                    WHEN 'TRACE'  THEN 0
                    WHEN 'DEBUG'  THEN 1
                    WHEN 'INFO'   THEN 2
                    WHEN 'WARN'   THEN 3
                    WHEN 'ERROR'  THEN 4
                    ELSE 1
                  END;

  IF ERR_LEVEL >= LOG_LEVEL
  THEN
    INSERT INTO `LVXX_TESTENV._INTEGRATION`
    VALUES (
      CURRENT_TIMESTAMP(),
      COALESCE(rootPid, CONCAT('_M', FORMAT_TIMESTAMP("%Y%m%d", CURRENT_TIMESTAMP))),
      COALESCE(step, 'Not provided'),
      errLevel,
      COALESCE(message, 'Not provided')
    );
  END IF;
END;