# Description
API for `REDACTED` `REDACTED` Service, interfaced with BigQuery.
Cloud Run endpoint: `REDACTED`

# Folder Structure
- `auth` should contain your *service accounts*
- `bin` has the startup script defined in *package.json*
- `controllers` has the businee code for each API
- `data` defines the connections
- `doc` created with *apidoc*
- `https` defines the *req*/*resp* templates and schemas
- `test` has the mockup calls in Postman (`REDACTED`)

# Test in Local Environment
## Setup
- Install the Google Cloud CLI (https://cloud.google.com/sdk/docs/quickstart-windows)
- Init your environment with
    ```shell
    npm init --yes
    ```
- Install the dependencies with
    ```shell
    npm install express
    npm install body-parser
    npm install @google-cloud/bigquery
    ```
    or reference *package.json* with
    ```shell
    npm install
    ```
- (optional) Install nodemon for development
    ```shell
    npm install -g nodemon
    npm i -D nodemon
    ```

- Set your own credentials in gcloud CLI, or run
    ```powershell
    $env:GOOGLE_APPLICATION_CREDENTIALS="<PATH>\sa-REDACTED.json"
    ```

## Build
```shell
gcloud builds submit --tag gcr.io/<PROJECT_ID>/<NAME> --project <PROJECT_ID>
```

# Business Requirement
Due to the PoC nature and the very strict budget, we had to design the API without a Cloud SQL in background. Everything is done in BigQuery, which is not fast enough for a sub-second response that we would expect in web interactions.
However, we figured that not all requests had to be processed in RT.

All controllers act the same, but there are two main categories:
1. **Async API** that can queue the requested operation: they will return immediately a *200 OK* code, and BigQuery will process them in background.
2. **Sync API** that need RT processing.