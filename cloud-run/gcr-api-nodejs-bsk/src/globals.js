/**
 * VERBOSE : 0,
 * DEBUG   : 1,
 * INFO    : 2,
 * WARN    : 3,
 * ERROR   : 4
 * 
 */
global.LOG_LEVEL    = process.env.LOG_LEVEL || 2;
global.IP_WHITELIST = process.env.IP_WHITELIST || '<REDACTED>,<REDACTED>,<REDACTED>'; // test and prod IP of <REDACTED> datac + AP home IP