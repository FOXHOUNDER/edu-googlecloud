**Description**<br>
> DryRun demo with a service account that's cross-project.<br>
> Goal: understand who gets billed when sa of proj-A reads from proj-B.

**Setup local env**<br>
> install GCLOUD SDK (https://cloud.google.com/sdk/docs/quickstart-windows)<br>
> run 
> ``` shell
> npm init --yes
> npm install --only=prod --no-optional
> npm install -g nodemon (optional)
> npm i -D nodemon (optional)
> $env:GOOGLE_APPLICATION_CREDENTIALS="<PATH>\sa-<REDACTED>.json"
> ```

**Build**<br>
> ``` shell
> gcloud builds submit --tag gcr.io/<PROJECT_ID>/<NAME> --project <PROJECT_ID> (e.g. gcloud builds submit --tag gcr.io/<REDACTED>/digitel.rest-apis --project <REDACTED>)
> ```