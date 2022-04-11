'use strict';

function main() {
  // Create a BigQuery client explicitly using service account credentials.
  // by specifying the private key file.
  const {BigQuery} = require('@google-cloud/bigquery');
  const bigquery = new BigQuery();

  async function queryDryRun() {
    // Runs a dry query of the U.S. given names dataset for the state of Texas.
    const query = `SELECT cst_typcptcli+1 FROM \`lmit-mktgdatamart-prod-itlm.jk_analytics.clienti_no_cltv\` LIMIT 1000`;

    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
      //keyFilename: '..\credentials\sa-billingtest.json',
      //projectId: 'silversea-293815', // dev civil-map-293815 - prod silversea-293815
      query: query,
      // Location must match that of the dataset(s) referenced in the query.
      location: 'EU',
      useQueryCache: false,
      dryRun: false,
    };
    
    // Run the query as a job
    const [job] = await bigquery.createQueryJob(options);

    // Print the status and statistics
    //console.log('Status:');
    //console.log(job);
    console.log('Status:');
    console.log(job.metadata.status);
    console.log('\nJob Statistics:');
    console.log(job.metadata.statistics);
  }

  queryDryRun();

}

main(...process.argv.slice(2));