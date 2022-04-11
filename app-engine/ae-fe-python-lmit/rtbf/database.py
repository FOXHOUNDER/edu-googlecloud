import os

from google.cloud import bigquery
from google.oauth2 import service_account

ENV = os.environ['ENV']

def rtbf_contact(num_cli):
  print("REQUESTED DB RTBF")

  # Config service account
  sa_path = os.environ['GOOGLE_APPLICATION_CREDENTIALS']
  credentials = service_account.Credentials.from_service_account_file(
    sa_path, scopes=["https://www.googleapis.com/auth/cloud-platform"],
  )

  # 1 - Interrogo BigQuery
  client = bigquery.Client(credentials=credentials, project=credentials.project_id)

  # FIRST_STEP
  query1 = """CALL `REDACTED-{}-REDACTED`({})""".format(ENV, num_cli)

  query_job1 = client.query(query1)
  results1 = query_job1.result()

  m1 = ""
  for row in results1:
    m1 += "{} <br/>".format(row[0])

  # SECOND_STEP
  query2 = """CALL `REDACTED-{}-REDACTED`({})""".format(ENV, num_cli)

  query_job2 = client.query(query2)
  results2 = query_job2.result()
  
  m2 = ""
  for row in results2:
    m2 += "{} <br/>".format(row[0])

  return m1+m2



if __name__ == "__main__":
  rtbf_contact(num_cli="0000001")